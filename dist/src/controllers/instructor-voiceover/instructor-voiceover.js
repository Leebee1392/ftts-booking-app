"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorVoiceoverController = void 0;
const enums_1 = require("../../domain/enums");
const test_voiceover_1 = require("../../domain/test-voiceover");
const language_1 = require("../../helpers/language");
const nsa_navigator_1 = __importDefault(require("../../helpers/nsa-navigator"));
const journey_helper_1 = require("../../helpers/journey-helper");
class InstructorVoiceoverController {
    constructor() {
        this.get = (req, res) => {
            var _a;
            if (!req.session.journey) {
                throw Error("InstructorVoiceoverController::get: No journey set");
            }
            if ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.inManagedBookingEditMode) {
                req.session.manageBookingEdits = undefined;
            }
            return this.renderPage(req, res);
        };
        this.post = (req, res) => {
            if (!req.session.journey) {
                throw Error("InstructorVoiceoverController::post: No journey set");
            }
            const { target } = req.session;
            const { inEditMode, inManagedBookingEditMode } = req.session.journey;
            if (req.hasErrors) {
                if (target === enums_1.Target.NI && inManagedBookingEditMode) {
                    req.errors.forEach((error) => {
                        error.msg = language_1.translate("voiceover.editMode.validationError");
                    });
                }
                return this.renderPage(req, res);
            }
            req.session.journey.shownVoiceoverPageFlag = true;
            const { voiceover } = req.body;
            if (inManagedBookingEditMode) {
                req.session.manageBookingEdits = {
                    ...req.session.manageBookingEdits,
                    voiceover,
                };
                return res.redirect("check-change");
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                voiceover,
            };
            if (inEditMode) {
                return journey_helper_1.isNonStandardJourney(req)
                    ? res.redirect("check-your-details")
                    : res.redirect("check-your-answers");
            }
            if (req.session.journey.receivedSupportRequestPageFlag) {
                return res.redirect("find-test-centre");
            }
            if (!journey_helper_1.isNonStandardJourney(req)) {
                return res.redirect("find-test-centre");
            }
            return res.redirect(nsa_navigator_1.default.getNextPage(req));
        };
        /* istanbul ignore next */
        this.voiceoverPostSchema = () => ({
            voiceover: {
                in: ["body"],
                errorMessage: () => language_1.translate("voiceover.validationError"),
                isEmpty: {
                    negated: true,
                },
            },
        });
        this.getBackLink = (req) => {
            var _a;
            if (!req.session.journey) {
                throw new Error("InstructorVoiceoverController::getBackLink: No Journey object found in session");
            }
            const { inEditMode } = req.session.journey;
            if (inEditMode) {
                return journey_helper_1.isNonStandardJourney(req)
                    ? "check-your-details"
                    : "check-your-answers";
            }
            if (!journey_helper_1.isNonStandardJourney(req)) {
                if (req.session.journey.shownStandardSupportPageFlag) {
                    return "select-standard-support";
                }
                if (req.session.target === enums_1.Target.GB &&
                    ((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.testType) === enums_1.TestType.ERS) {
                    return "test-type";
                }
                if (req.session.target === enums_1.Target.GB) {
                    return "test-language";
                }
                if (req.session.target === enums_1.Target.NI) {
                    if (req.session.journey.receivedSupportRequestPageFlag) {
                        return "received-support-request";
                    }
                    return "test-type";
                }
            }
            return nsa_navigator_1.default.getPreviousPage(req);
        };
    }
    renderPage(req, res) {
        var _a;
        if (!req.session.journey) {
            throw new Error("InstructorVoiceoverController::renderPage: No Journey object found in session");
        }
        if (!req.session.currentBooking) {
            throw new Error("InstructorVoiceoverController::renderPage: No Current Booking object found in session");
        }
        const { inManagedBookingEditMode, inEditMode, receivedSupportRequestPageFlag, } = req.session.journey;
        const { currentBooking } = req.session;
        let chosenOption;
        const target = (_a = req.session.target) !== null && _a !== void 0 ? _a : enums_1.Target.GB;
        const { testType } = currentBooking;
        if (!testType) {
            throw new Error("InstructorVoiceoverController::renderPage: Missing test type in session current booking");
        }
        const availableOptions = test_voiceover_1.TestVoiceover.availableOptions(target, testType);
        if (availableOptions.length === 0 && !journey_helper_1.isNonStandardJourney(req)) {
            return res.redirect("find-test-centre");
        }
        if (currentBooking.voiceover &&
            req.session.journey.shownVoiceoverPageFlag) {
            chosenOption = currentBooking.voiceover;
        }
        const radioItems = [];
        availableOptions.forEach((option) => {
            let optionText = language_1.translate(`generalContent.language.${option}`);
            if ((inEditMode ||
                inManagedBookingEditMode ||
                receivedSupportRequestPageFlag ||
                !journey_helper_1.isNonStandardJourney(req)) &&
                target === enums_1.Target.GB) {
                optionText = `${language_1.translate("voiceover.editMode.yesOptionPrefix")} ${language_1.translate(`generalContent.language.${option}`)}`;
            }
            radioItems.push({
                value: option,
                text: optionText,
                checked: inManagedBookingEditMode ? false : chosenOption === option,
            });
        });
        if (inEditMode ||
            inManagedBookingEditMode ||
            req.session.journey.receivedSupportRequestPageFlag ||
            !journey_helper_1.isNonStandardJourney(req)) {
            radioItems.push({
                value: enums_1.Voiceover.NONE,
                text: language_1.translate("voiceover.editMode.noOption"),
                checked: inManagedBookingEditMode
                    ? false
                    : chosenOption === enums_1.Voiceover.NONE,
            });
        }
        return res.render("instructor/voiceover", {
            inManagedBookingEditMode,
            isNonStandardJourney: journey_helper_1.isNonStandardJourney(req),
            radioItems,
            bookingRef: currentBooking.bookingRef,
            receivedSupportRequestPageFlag: req.session.journey.receivedSupportRequestPageFlag,
            isERSTestType: req.session.currentBooking.testType === enums_1.TestType.ERS,
            backLink: this.getBackLink(req),
            errors: req.errors,
        });
    }
}
exports.InstructorVoiceoverController = InstructorVoiceoverController;
exports.default = new InstructorVoiceoverController();
