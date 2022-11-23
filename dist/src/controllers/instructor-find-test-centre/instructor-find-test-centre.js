"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorFindTestCentreController = void 0;
const enums_1 = require("../../domain/enums");
const journey_helper_1 = require("../../helpers/journey-helper");
const language_1 = require("../../helpers/language");
class InstructorFindTestCentreController {
    constructor() {
        this.get = (req, res) => {
            var _a, _b;
            if (!req.session.journey) {
                throw Error("InstructorFindTestCentreController::get: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("InstructorFindTestCentreController::get: No currentBooking set");
            }
            const { testCentreSearch } = req.session;
            const { inEditMode } = req.session.journey;
            if (testCentreSearch === null || testCentreSearch === void 0 ? void 0 : testCentreSearch.zeroCentreResults) {
                req.errors = [
                    {
                        msg: language_1.translate("findTestCentre.errorNotRecognised"),
                        param: "searchQuery",
                    },
                ];
                // Remove the flag so we don't keep showing the validation
                req.session.testCentreSearch = {
                    ...req.session.testCentreSearch,
                    zeroCentreResults: false,
                };
            }
            let backLink;
            if (journey_helper_1.isSupportedStandardJourney(req)) {
                // Back link for coming into the SA journey from NSA
                backLink = "nsa/email-contact";
            }
            else if (req.session.target === enums_1.Target.NI && !journey_helper_1.isNonStandardJourney(req)) {
                if (req.session.journey.receivedSupportRequestPageFlag) {
                    backLink = "received-support-request";
                }
                else {
                    backLink = "test-type";
                }
            }
            else if (req.session.journey.shownVoiceoverPageFlag) {
                backLink = "change-voiceover";
            }
            else if (req.session.journey.shownStandardSupportPageFlag) {
                backLink = "select-standard-support";
            }
            else {
                backLink = "test-type";
            }
            res.render("instructor/find-test-centre", {
                errors: ((_a = req.errors) === null || _a === void 0 ? void 0 : _a.length) ? req.errors : undefined,
                searchQuery: !inEditMode ? testCentreSearch === null || testCentreSearch === void 0 ? void 0 : testCentreSearch.searchQuery : undefined,
                backLink,
                noResultsError: !((_b = req.errors) === null || _b === void 0 ? void 0 : _b.length),
            });
        };
        this.post = (req, res) => {
            var _a;
            if (!req.session.journey) {
                throw Error("InstructorFindTestCentreController::post: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("InstructorFindTestCentreController::post: No currentBooking set");
            }
            const { support, standardAccommodation } = req.session.journey;
            if (req.hasErrors) {
                let backLink = "test-language";
                if (support && standardAccommodation) {
                    backLink = "email-contact";
                }
                return res.render("instructor/find-test-centre", {
                    errors: req.errors,
                    backLink,
                    noResultsError: !((_a = req.errors) === null || _a === void 0 ? void 0 : _a.length),
                });
            }
            const { searchQuery } = req.body;
            req.session.testCentreSearch = {
                ...req.session.testCentreSearch,
                searchQuery,
                numberOfResults: undefined,
            };
            return res.redirect("select-test-centre");
        };
        /* istanbul ignore next */
        this.postSchemaValidation = {
            searchQuery: {
                in: ["body"],
                isLength: {
                    errorMessage: () => language_1.translate("findTestCentre.errorNotRecognised"),
                    options: {
                        min: 3,
                        max: 512,
                    },
                },
            },
        };
    }
}
exports.InstructorFindTestCentreController = InstructorFindTestCentreController;
exports.default = new InstructorFindTestCentreController();
