"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
const nsa_navigator_1 = __importDefault(require("../../helpers/nsa-navigator"));
const support_1 = require("../../helpers/support");
const request_sanitizer_1 = require("../../libraries/request-sanitizer");
class SelectSupportType {
    constructor() {
        this.supportTypes = [
            enums_1.SupportType.ON_SCREEN_BSL,
            enums_1.SupportType.BSL_INTERPRETER,
            enums_1.SupportType.VOICEOVER,
            enums_1.SupportType.TRANSLATOR,
            enums_1.SupportType.EXTRA_TIME,
            enums_1.SupportType.READING_SUPPORT,
            enums_1.SupportType.OTHER,
        ];
        this.get = (req, res) => {
            this.render(req, res);
        };
        this.post = (req, res) => {
            if (req.hasErrors) {
                return this.render(req, res);
            }
            if (!req.session.journey) {
                throw Error("SelectSupportType::post: No journey set");
            }
            this.resetSessionOptions(req);
            const { selectSupportType } = req.body;
            let supportTypes = [];
            if (typeof selectSupportType === "string") {
                supportTypes.push(selectSupportType);
            }
            else {
                supportTypes = selectSupportType;
            }
            const updatedCurrentBooking = {
                selectSupportType: supportTypes,
            };
            if (supportTypes.includes(enums_1.SupportType.ON_SCREEN_BSL)) {
                updatedCurrentBooking.bsl = true;
                updatedCurrentBooking.translator = undefined;
                updatedCurrentBooking.customSupport = undefined;
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                ...updatedCurrentBooking,
            };
            if (req.session.journey.confirmingSupport) {
                req.session.journey.confirmingSupport = undefined;
                req.session.currentBooking.customSupport = undefined;
            }
            const { inEditMode } = req.session.journey;
            if (inEditMode) {
                req.session.journey = {
                    ...req.session.journey,
                    inEditMode: false,
                };
            }
            return res.redirect(nsa_navigator_1.default.getNextPage(req));
        };
        this.render = (req, res) => {
            if (!req.session.currentBooking) {
                throw Error("SelectSupportType::render: No currentBooking set");
            }
            this.options.clear();
            this.options = support_1.toSupportTypeOptions(this.supportTypes);
            support_1.removeInvalidOptions(this.options, req);
            const { selectSupportType } = req.session.currentBooking;
            const body = req.body;
            const supportOptions = body.selectSupportType || selectSupportType;
            const options = [];
            this.options.forEach((value) => options.push(value));
            options.forEach((option) => {
                option.checked = (supportOptions === null || supportOptions === void 0 ? void 0 : supportOptions.includes(option.value)) || false;
                return option;
            });
            return res.render("supported/select-support-type", {
                errors: req.errors,
                options,
                backLink: this.getBackLink(req),
            });
        };
        /* istanbul ignore next */
        this.postSchemaValidation = (req) => ({
            selectSupportType: {
                in: ["body"],
                custom: {
                    options: this.supportTypeValidator(req),
                },
            },
        });
        this.supportTypeValidator = (req) => (value) => {
            if (!value) {
                throw new Error(language_1.translate("selectSupportType.errors.noneSelected"));
            }
            // Not allowed to select sign language and voiceover together
            if (value.includes(enums_1.SupportType.ON_SCREEN_BSL) &&
                value.includes(enums_1.SupportType.VOICEOVER)) {
                throw new Error(language_1.translate("selectSupportType.errors.badCombination"));
            }
            if (this.hasInvalidOptionSelected(req, value)) {
                throw new Error(language_1.translate("selectSupportType.errors.invalidOptionSelected"));
            }
            return value;
        };
        this.getBackLink = (req) => {
            var _a;
            if (!req.session.journey) {
                throw Error("SelectSupportType::getBackLink: No journey set");
            }
            const { inEditMode } = req.session.journey;
            if (inEditMode) {
                return "check-your-details";
            }
            if (req.session.journey.confirmingSupport) {
                return "confirm-support";
            }
            // Go back to the test-type page for NI (Cannot change test language for NI)
            // Go back to test type page for ERS Tests
            if (req.session.target === enums_1.Target.NI ||
                ((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.testType) === enums_1.TestType.ERS) {
                return "test-type";
            }
            return "test-language";
        };
        this.resetSessionOptions = (req) => {
            if (!req.session.currentBooking) {
                throw new Error("SelectSupportType::resetSessionOptions: No journey set");
            }
            const { selectSupportType } = req.body;
            const { bsl, voiceover, translator, customSupport } = req.session.currentBooking;
            let updatedBsl = false;
            let updatedVoiceover = enums_1.Voiceover.NONE;
            let updatedCustomSupport = enums_1.SupportType.NONE;
            let updatedTranslator;
            if (selectSupportType.includes(enums_1.SupportType.ON_SCREEN_BSL)) {
                updatedBsl = bsl;
            }
            if (selectSupportType.includes(enums_1.SupportType.VOICEOVER)) {
                updatedVoiceover = voiceover;
            }
            if (selectSupportType.includes(enums_1.SupportType.TRANSLATOR)) {
                updatedTranslator = translator;
            }
            if (selectSupportType.includes(enums_1.SupportType.OTHER)) {
                updatedCustomSupport = customSupport;
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                bsl: updatedBsl,
                voiceover: updatedVoiceover,
                translator: updatedTranslator,
                customSupport: updatedCustomSupport,
            };
        };
        this.options = new Map();
    }
    hasInvalidOptionSelected(req, value) {
        var _a;
        const testType = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.testType;
        const { target } = req.session;
        const invalidOptions = support_1.getInvalidOptions(testType, target);
        if (invalidOptions.length > 0) {
            const invalidOptionSelected = request_sanitizer_1.stringToArray(value).find((element) => invalidOptions.includes(element));
            if (invalidOptionSelected)
                return true;
        }
        return false;
    }
}
exports.default = new SelectSupportType();
