"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSupportController = void 0;
const language_1 = require("../../helpers/language");
const custom_support_helper_1 = require("../../helpers/custom-support-helper");
const nsa_navigator_1 = __importDefault(require("../../helpers/nsa-navigator"));
const support_1 = require("../../helpers/support");
const config_1 = __importDefault(require("../../config"));
class CustomSupportController {
    constructor() {
        this.get = (req, res) => this.render(req, res);
        this.post = (req, res) => {
            var _a;
            if (!req.session.journey) {
                throw Error("CustomSupportController::post: No journey set");
            }
            const selectedSupportTypes = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.selectSupportType;
            if (!selectedSupportTypes) {
                throw Error("CustomSupportController::getSkipLink: Missing support types session data");
            }
            const { support } = req.body;
            const { inEditMode } = req.session.journey;
            req.session.currentBooking = {
                ...req.session.currentBooking,
                customSupport: support,
            };
            if (req.hasErrors) {
                return this.render(req, res);
            }
            if (config_1.default.featureToggles.enableCustomSupportInputValidation &&
                !support_1.isNonStandardSupportSelected(selectedSupportTypes) &&
                custom_support_helper_1.isCustomSupportInputEmptyOrUnmeaningful(support)) {
                req.session.journey.inEditMode = false;
                if (support_1.isOnlyCustomSupportSelected(selectedSupportTypes)) {
                    return res.redirect("confirm-support");
                }
                return res.redirect("leaving-nsa"); // 'Other' + standard support selected
            }
            return inEditMode
                ? res.redirect("check-your-details")
                : res.redirect(nsa_navigator_1.default.getNextPage(req));
        };
        this.render = (req, res) => {
            var _a;
            res.render("supported/custom-support", {
                errors: req.errors,
                savedCustomSupport: (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.customSupport,
                backLink: this.getBackLink(req),
                skipLink: this.getSkipLink(req),
            });
        };
        this.getBackLink = (req) => {
            if (!req.session.journey) {
                throw Error("CustomSupportController::getBackLink: No journey set");
            }
            const { inEditMode } = req.session.journey;
            return inEditMode
                ? "check-your-details"
                : nsa_navigator_1.default.getPreviousPage(req);
        };
        this.getSkipLink = (req) => {
            var _a;
            const selectedSupportTypes = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.selectSupportType;
            if (!selectedSupportTypes) {
                throw Error("CustomSupportController::getSkipLink: Missing support types session data");
            }
            if (config_1.default.featureToggles.enableCustomSupportInputValidation) {
                if (support_1.isOnlyCustomSupportSelected(selectedSupportTypes)) {
                    return "confirm-support";
                }
                if (!support_1.isNonStandardSupportSelected(selectedSupportTypes)) {
                    return "leaving-nsa";
                }
            }
            return "staying-nsa";
        };
        /* istanbul ignore next */
        this.postSchemaValidation = () => ({
            support: {
                in: ["body"],
                isLength: {
                    options: { max: 4000 },
                    errorMessage: () => language_1.translate("customSupport.errorMessage"),
                },
            },
        });
    }
}
exports.CustomSupportController = CustomSupportController;
exports.default = new CustomSupportController();
