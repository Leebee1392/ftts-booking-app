"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const language_1 = require("../../helpers/language");
const date_input_1 = require("../../domain/date-input");
class InstructorSelectDateController {
    constructor() {
        this.get = (req, res) => {
            var _a, _b, _c, _d, _e;
            if (!req.session.journey) {
                throw Error("InstructorSelectDateController::get: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("InstructorSelectDateController::get: No currentBooking set");
            }
            if (!req.session.candidate && !((_a = req.session.manageBooking) === null || _a === void 0 ? void 0 : _a.candidate)) {
                throw Error("InstructorSelectDateController::get: No candidate set");
            }
            let selectedDate;
            const dateString = (_b = req.session.testCentreSearch) === null || _b === void 0 ? void 0 : _b.selectedDate;
            const { inEditMode } = req.session.journey;
            if (dateString && !inEditMode) {
                selectedDate = date_input_1.DateInput.split(dateString);
            }
            const candidateEligibilities = ((_c = req.session.candidate) === null || _c === void 0 ? void 0 : _c.eligibilities) ||
                ((_e = (_d = req.session.manageBooking) === null || _d === void 0 ? void 0 : _d.candidate) === null || _e === void 0 ? void 0 : _e.eligibilities);
            const test = candidateEligibilities === null || candidateEligibilities === void 0 ? void 0 : candidateEligibilities.find((eligibility) => { var _a; return eligibility.testType === ((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.testType); });
            if (!test) {
                throw new Error("InstructorSelectDateController::get: Test type mismatch");
            }
            return res.render("instructor/select-date", {
                ...selectedDate,
                minDate: date_input_1.DateInput.min,
                maxDate: date_input_1.DateInput.max,
                selectTestCentreLink: "select-test-centre",
                isManagedBookingSession: this.isManagedBookingSession(req),
            });
        };
        this.post = (req, res) => {
            var _a, _b, _c, _d;
            if (!req.session.candidate && !((_a = req.session.manageBooking) === null || _a === void 0 ? void 0 : _a.candidate)) {
                throw Error("InstructorSelectDateController::post: No candidate set");
            }
            if (req.hasErrors) {
                // Only want to show one error at a time
                // If multiple fields are empty, show a single invalid date error
                const error = req.errors[0];
                if (req.errors.length > 2) {
                    error.param = "date";
                    error.msg = "dateNotValid";
                }
                error.msg = language_1.translate(`selectDate.errorMessages.${error.msg}`);
                const candidateEligibilities = ((_b = req.session.candidate) === null || _b === void 0 ? void 0 : _b.eligibilities) ||
                    ((_d = (_c = req.session.manageBooking) === null || _c === void 0 ? void 0 : _c.candidate) === null || _d === void 0 ? void 0 : _d.eligibilities);
                const test = candidateEligibilities === null || candidateEligibilities === void 0 ? void 0 : candidateEligibilities.find((eligibility) => { var _a; return eligibility.testType === ((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.testType); });
                if (!test) {
                    throw new Error("InstructorSelectDateController::post: Test type mismatch");
                }
                return res.render("instructor/select-date", {
                    ...req.body,
                    errors: [error],
                    minDate: date_input_1.DateInput.min,
                    maxDate: date_input_1.DateInput.max,
                    selectTestCentreLink: "select-test-centre",
                    isManagedBookingSession: this.isManagedBookingSession(req),
                });
            }
            if (!req.session.currentBooking) {
                throw Error("InstructorSelectDateController::post: No currentBooking set");
            }
            const { firstSelectedDate } = req.session.currentBooking;
            const dateString = date_input_1.DateInput.of(req.body).toISOFormat();
            if (!firstSelectedDate) {
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    firstSelectedDate: dateString,
                };
            }
            req.session.testCentreSearch = {
                ...req.session.testCentreSearch,
                selectedDate: dateString,
            };
            return res.redirect("choose-appointment");
        };
        /* istanbul ignore next */
        this.postSchemaValidation = {
            day: {
                in: ["body"],
                notEmpty: true,
                errorMessage: "dayEmpty",
            },
            month: {
                in: ["body"],
                isEmpty: {
                    errorMessage: "monthEmpty",
                    negated: true,
                },
            },
            year: {
                in: ["body"],
                isEmpty: {
                    errorMessage: "yearEmpty",
                    negated: true,
                },
            },
            date: {
                custom: {
                    options: date_input_1.DateInput.isValid,
                },
            },
        };
    }
    isManagedBookingSession(req) {
        var _a;
        return ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.inManagedBookingEditMode) || false;
    }
}
exports.default = new InstructorSelectDateController();
