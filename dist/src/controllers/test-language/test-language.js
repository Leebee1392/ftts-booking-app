"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLanguageController = void 0;
const test_language_1 = require("../../domain/test-language");
const enums_1 = require("../../domain/enums");
const journey_helper_1 = require("../../helpers/journey-helper");
class TestLanguageController {
    constructor() {
        this.get = (req, res) => {
            if (!req.session.journey) {
                throw Error("TestLanguageController::get: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("TestLanguageController::get: No currentBooking set");
            }
            const { inManagedBookingEditMode } = req.session.journey;
            // Skip this page in a Northern Ireland Session or ERS Test and set default language to english
            if (req.session.journey.isInstructor) {
                if (!test_language_1.TestLanguage.canChangeTestLanguage(req.session.target || enums_1.Target.GB, req.session.currentBooking.testType) &&
                    !req.session.journey.receivedSupportRequestPageFlag) {
                    req.session.currentBooking = {
                        ...req.session.currentBooking,
                        language: enums_1.Language.ENGLISH,
                    };
                    return res.redirect(journey_helper_1.isStandardJourney(req)
                        ? "select-standard-support"
                        : "select-support-type");
                }
            }
            else if (req.session.target === enums_1.Target.NI) {
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    language: enums_1.Language.ENGLISH,
                };
                return res.redirect(journey_helper_1.isStandardJourney(req)
                    ? "select-standard-support"
                    : "select-support-type");
            }
            if (inManagedBookingEditMode) {
                req.session.manageBookingEdits = undefined;
            }
            return this.renderPage(req, res);
        };
        this.post = (req, res) => {
            var _a, _b;
            if (req.hasErrors) {
                return this.renderPage(req, res);
            }
            if (!req.session.journey) {
                throw Error("TestLanguageController::post: No journey set");
            }
            if (!((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.testType)) {
                throw Error("TestLanguageController::post: No test type set");
            }
            const testType = (_b = req.session.currentBooking) === null || _b === void 0 ? void 0 : _b.testType;
            const canChangeLanguage = test_language_1.TestLanguage.canChangeTestLanguage(req.session.target || enums_1.Target.GB, testType);
            if (!canChangeLanguage) {
                throw Error(`TestLanguageController::post: Cannot change test language for test type: ${testType} and target ${req.session.target}`);
            }
            const { testLanguage } = req.body;
            const language = testLanguage === enums_1.Language.ENGLISH ? enums_1.Language.ENGLISH : enums_1.Language.WELSH;
            const { inEditMode, inManagedBookingEditMode } = req.session.journey;
            if (inManagedBookingEditMode) {
                req.session.manageBookingEdits = {
                    ...req.session.manageBookingEdits,
                    language,
                };
                return res.redirect("/manage-booking/check-change");
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                language,
            };
            if (inEditMode) {
                if (journey_helper_1.isStandardJourney(req) || journey_helper_1.isSupportedStandardJourney(req)) {
                    return res.redirect("check-your-answers");
                }
                return res.redirect("check-your-details");
            }
            return journey_helper_1.isNonStandardJourney(req)
                ? res.redirect("select-support-type")
                : res.redirect("select-standard-support");
        };
        /* istanbul ignore next */
        this.testLanguagePostSchema = () => ({
            testLanguage: {
                in: ["body"],
                custom: {
                    options: test_language_1.TestLanguage.isValid,
                },
            },
        });
    }
    renderPage(req, res) {
        var _a;
        if (!req.session.journey) {
            throw Error("TestLanguageController::renderPage: No journey set");
        }
        const { inManagedBookingEditMode, inEditMode } = req.session.journey;
        const booking = req.session.currentBooking;
        const chosenTestLanguage = inManagedBookingEditMode
            ? undefined
            : (_a = this.selectedLanguage(req)) === null || _a === void 0 ? void 0 : _a.key();
        let backLink;
        if (inEditMode) {
            if (journey_helper_1.isStandardJourney(req) || journey_helper_1.isSupportedStandardJourney(req)) {
                backLink = "check-your-answers";
            }
            else {
                backLink = "check-your-details";
            }
        }
        else if (inManagedBookingEditMode) {
            backLink = booking === null || booking === void 0 ? void 0 : booking.bookingRef;
        }
        else if (req.session.journey.receivedSupportRequestPageFlag) {
            backLink = "received-support-request";
        }
        else {
            backLink = "test-type";
        }
        return res.render("common/test-language", {
            availableLanguages: test_language_1.TestLanguage.availableLanguages(),
            errors: req.errors,
            booking: req.session.currentBooking,
            inManagedBookingEditMode,
            backLink,
            chosenTestLanguage,
        });
    }
    selectedLanguage(req) {
        if (!req.session.currentBooking) {
            throw Error("TestLanguageController::selectedLanguage: No currentBooking set");
        }
        const { language } = req.session.currentBooking;
        return language ? new test_language_1.TestLanguage(language) : undefined;
    }
}
exports.TestLanguageController = TestLanguageController;
exports.default = new TestLanguageController();
