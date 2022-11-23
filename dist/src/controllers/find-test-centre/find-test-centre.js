"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindTestCentreController = void 0;
const journey_helper_1 = require("../../helpers/journey-helper");
const language_1 = require("../../helpers/language");
class FindTestCentreController {
    constructor() {
        this.get = (req, res) => {
            var _a, _b;
            if (!req.session.journey) {
                throw Error("FindTestCentreController::get: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("FindTestCentreController::get: No currentBooking set");
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
            if (this.isManagedBookingSession(req)) {
                backLink = `manage-change-location-time/${req.session.currentBooking.bookingRef}`;
            }
            else if (journey_helper_1.isSupportedStandardJourney(req)) {
                // Back link for coming into the SA journey from NSA
                backLink = "/nsa/email-contact";
            }
            else if (req.session.journey.shownVoiceoverPageFlag) {
                backLink = "change-voiceover";
            }
            else if (req.session.journey.shownStandardSupportPageFlag) {
                backLink = "select-standard-support";
            }
            res.render("common/find-test-centre", {
                errors: ((_a = req.errors) === null || _a === void 0 ? void 0 : _a.length) ? req.errors : undefined,
                searchQuery: !inEditMode ? testCentreSearch === null || testCentreSearch === void 0 ? void 0 : testCentreSearch.searchQuery : undefined,
                noResultsError: !((_b = req.errors) === null || _b === void 0 ? void 0 : _b.length),
                backLink,
            });
        };
        this.post = (req, res) => {
            var _a;
            if (!req.session.journey) {
                throw Error("FindTestCentreController::post: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("FindTestCentreController::post: No currentBooking set");
            }
            const { support, standardAccommodation } = req.session.journey;
            if (req.hasErrors) {
                let backLink = !this.isManagedBookingSession(req)
                    ? "/test-language"
                    : `/manage-change-location-time/${req.session.currentBooking.bookingRef}`;
                if (support && standardAccommodation) {
                    backLink = "/email-contact";
                }
                return res.render("common/find-test-centre", {
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
            return res.redirect(!this.isManagedBookingSession(req)
                ? "/select-test-centre"
                : "/manage-booking/select-test-centre");
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
    isManagedBookingSession(req) {
        var _a;
        return ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.inManagedBookingEditMode) || false;
    }
}
exports.FindTestCentreController = FindTestCentreController;
exports.default = new FindTestCentreController();
