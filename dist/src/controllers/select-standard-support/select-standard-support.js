"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
const bsl_1 = require("../../domain/bsl");
class SelectStandardSupportController {
    constructor() {
        this.supportTypes = [
            enums_1.SupportType.ON_SCREEN_BSL,
            enums_1.SupportType.VOICEOVER,
            enums_1.SupportType.NO_SUPPORT_WANTED,
        ];
        this.get = (req, res) => {
            if (!req.session.journey) {
                throw Error("SelectStandardSupportController::get: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("SelectStandardSupportController::get: No currentBooking set");
            }
            // if the user comes back to select standard support page, reset shown voiceover page flag
            req.session.journey.shownVoiceoverPageFlag = false;
            this.render(req, res);
        };
        this.post = (req, res) => {
            if (!req.session.journey) {
                throw Error("SelectStandardSupportController::post: No journey set");
            }
            if (req.hasErrors) {
                return this.render(req, res);
            }
            const { selectStandardSupportType } = req.body;
            if (selectStandardSupportType === enums_1.SupportType.ON_SCREEN_BSL) {
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    bsl: true,
                    voiceover: enums_1.Voiceover.NONE,
                    selectStandardSupportType,
                };
                req.session.lastPage = "select-standard-support";
                return res.redirect("find-test-centre");
            }
            if (selectStandardSupportType === enums_1.SupportType.VOICEOVER) {
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    bsl: false,
                    selectStandardSupportType,
                };
                return res.redirect("change-voiceover");
            }
            if (selectStandardSupportType === enums_1.SupportType.NO_SUPPORT_WANTED) {
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    bsl: false,
                    voiceover: enums_1.Voiceover.NONE,
                    selectStandardSupportType,
                };
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                bsl: false,
                voiceover: enums_1.Voiceover.NONE,
                selectStandardSupportType,
            };
            const { inEditMode } = req.session.journey;
            if (inEditMode) {
                req.session.journey = {
                    ...req.session.journey,
                    inEditMode: false,
                };
            }
            req.session.lastPage = "select-standard-support";
            return res.redirect("find-test-centre");
        };
        this.render = (req, res) => {
            if (!req.session.currentBooking) {
                throw Error("SelectStandardSupportController::render: No currentBooking set");
            }
            if (!req.session.journey) {
                throw Error("SelectStandardSupportController::render: No journey set");
            }
            const { testType } = req.session.currentBooking;
            if (!bsl_1.bslIsAvailable(testType)) {
                return res.redirect("change-voiceover");
            }
            req.session.journey.shownStandardSupportPageFlag = true;
            this.supportOptions.clear();
            this.supportTypes.forEach((val) => {
                var _a;
                this.supportOptions.set(val, {
                    attributes: {
                        "data-automation-id": `support-${val}`,
                    },
                    checked: val === ((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.selectStandardSupportType),
                    value: val,
                    text: language_1.translate(`selectStandardSupportType.${val}`),
                });
            });
            const options = [];
            this.supportOptions.forEach((value) => options.push(value));
            return res.render("common/select-standard-support", {
                errors: req.errors,
                options,
                backLink: this.getBackLink(req),
            });
        };
        // private isSupportTypeChecked(supportType: SupportType, req: Request): boolean {
        //   // const bslSelected = req.session.currentBooking?.bsl;
        //   // if (supportType === SupportType.ON_SCREEN_BSL && bslSelected) {
        //   //   return true;
        //   // }
        //   // const voiceoverSelected = !req.session.currentBooking?.voiceover || req.session.currentBooking?.voiceover !== Voiceover.NONE;
        //   // if (supportType === SupportType.VOICEOVER && voiceoverSelected) {
        //   //   return true;
        //   // }
        //   // if (supportType === SupportType.NO_SUPPORT_WANTED && !bslSelected && !voiceoverSelected) {
        //   //   return true;
        //   // }
        //   // return false;
        //   if (supportType === req.session.currentBooking?.selectStandardSupportType) {
        //     return true;
        //   }
        //   return false;
        // }
        /* istanbul ignore next */
        this.postSchemaValidation = () => ({
            selectStandardSupportType: {
                in: ["body"],
                custom: {
                    options: this.supportTypeValidator,
                },
            },
        });
        this.supportTypeValidator = (value) => {
            if (!value) {
                throw new Error(language_1.translate("voicemail.errorBannerNotification"));
            }
            return value;
        };
        this.getBackLink = (req) => {
            if (!req.session.journey) {
                throw Error("SelectStandardSupportController::getBackLink: No journey set");
            }
            if (req.session.target === enums_1.Target.GB) {
                return "test-language";
            }
            // DVA
            if (req.session.journey.receivedSupportRequestPageFlag) {
                return "received-support-request";
            }
            return "test-type";
        };
        this.supportOptions = new Map();
    }
}
exports.default = new SelectStandardSupportController();
