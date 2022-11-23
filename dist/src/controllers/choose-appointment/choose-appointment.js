"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseAppointmentController = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const language_1 = require("../../helpers/language");
const scheduling_helper_1 = require("../../services/scheduling/scheduling-helper");
const utc_date_1 = require("../../domain/utc-date");
const appointment_service_1 = require("../../services/appointment/appointment-service");
const enums_1 = require("../../domain/enums");
class ChooseAppointmentController {
    constructor(appointmentService) {
        this.appointmentService = appointmentService;
        this.get = async (req, res) => {
            if (!req.session.journey) {
                throw Error("ChooseAppointmentController::get: No journey set");
            }
            if (!req.session.currentBooking) {
                throw Error("ChooseAppointmentController::get: No currentBooking set");
            }
            if (!req.session.currentBooking.centre) {
                return res.redirect(this.getSelectTestCentreLink(req));
            }
            if (req.hasErrors) {
                return res.status(400).render("common/choose-appointment", {
                    errors: req.errors,
                });
            }
            return this.renderPage(req, res);
        };
        this.post = async (req, res) => {
            if (req.hasErrors) {
                return this.renderPage(req, res);
            }
            if (!req.session.journey) {
                throw Error("ChooseAppointmentController::post: No journey set");
            }
            const { slotId: dateTime } = req.body;
            if (this.isManagedBookingSession(req)) {
                req.session.manageBookingEdits = {
                    ...req.session.manageBookingEdits,
                    dateTime,
                };
            }
            else {
                const { inEditMode } = req.session.journey;
                if (!inEditMode) {
                    req.session.currentBooking = {
                        ...req.session.currentBooking,
                        dateTime,
                    };
                }
                else {
                    req.session.editedLocationTime = {
                        ...req.session.editedLocationTime,
                        dateTime,
                    };
                }
            }
            return res.redirect(this.getCheckAnswersLink(req));
        };
        /* istanbul ignore next */
        this.getSchemaValidation = {
            selectedDate: {
                in: ["query"],
                optional: true,
                custom: {
                    options: utc_date_1.UtcDate.isValidIsoDateString,
                },
            },
        };
        /* istanbul ignore next */
        this.postSchemaValidation = {
            slotId: {
                in: ["body"],
                isEmpty: {
                    errorMessage: "Booking Slot is required. Please pick a Slot.",
                    negated: true,
                    bail: true,
                },
                custom: {
                    errorMessage: () => language_1.translate("chooseAppointment.errorMessages.invalidSlot"),
                    options: utc_date_1.UtcDate.isValidIsoTimeStamp,
                },
            },
        };
    }
    async renderPage(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!req.session.journey) {
            throw Error("ChooseAppointmentController::renderPage: No journey set");
        }
        if (!req.session.currentBooking) {
            throw Error("ChooseAppointmentController::renderPage: No currentBooking set");
        }
        if (!((_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.eligibilities) &&
            !((_c = (_b = req.session.manageBooking) === null || _b === void 0 ? void 0 : _b.candidate) === null || _c === void 0 ? void 0 : _c.eligibilities)) {
            throw Error("ChooseAppointmentController::renderPage: No candidate eligibilities set");
        }
        const booking = req.session.currentBooking;
        if (!booking.centre) {
            throw Error("ChooseAppointmentController::renderPage: No booking.centre set");
        }
        const { testType } = booking;
        let { firstSelectedDate } = booking;
        if (!testType) {
            throw Error("ChooseAppointmentController::renderPage: No testType set");
        }
        const { testCentreSearch } = req.session;
        const candidateEligibilities = ((_d = req.session.candidate) === null || _d === void 0 ? void 0 : _d.eligibilities) ||
            ((_f = (_e = req.session.manageBooking) === null || _e === void 0 ? void 0 : _e.candidate) === null || _f === void 0 ? void 0 : _f.eligibilities);
        const testEligibility = this.getTestEligibility(candidateEligibilities, booking.testType);
        const { inEditMode } = req.session.journey;
        const newEditedCentre = (_g = req.session.editedLocationTime) === null || _g === void 0 ? void 0 : _g.centre;
        let selectedCentre;
        if (inEditMode && newEditedCentre) {
            selectedCentre = newEditedCentre;
        }
        else {
            selectedCentre = booking.centre;
        }
        if (this.isManagedBookingSession(req)) {
            const centre = (_h = req.session.manageBookingEdits) === null || _h === void 0 ? void 0 : _h.centre;
            if (centre) {
                selectedCentre = centre;
            }
        }
        if (scheduling_helper_1.hasSlotsKpis(booking)) {
            // We only want to request the KPI's once per session
            firstSelectedDate = undefined;
        }
        const selectedDate = dayjs_1.default(req.query.selectedDate || (testCentreSearch === null || testCentreSearch === void 0 ? void 0 : testCentreSearch.selectedDate)).tz();
        const { slotsByDate, kpiIdentifiers } = await this.appointmentService.getSlots(selectedDate, selectedCentre, testType, testEligibility, firstSelectedDate);
        const { morningSlots, afternoonSlots } = this.splitIntoMorningAndAfternoonSlots(slotsByDate, selectedDate);
        this.storeKpiIdentifiersInSession(kpiIdentifiers, req);
        const today = dayjs_1.default().tz().startOf("day");
        const sixMonths = dayjs_1.default().tz().add(6, "month").subtract(1, "day");
        const { weekView, weekViewMobile, navigation } = this.buildNavigation(selectedDate);
        const renderParameters = {
            weekView,
            weekViewMobile,
            navigation,
            slotsByDate,
            morningSlots,
            afternoonSlots,
            selectedDate: utc_date_1.toISODateString(selectedDate),
            isBeforeToday: selectedDate.isBefore(today),
            isAfterSixMonths: selectedDate.isAfter(sixMonths),
            isBeforeEligible: testEligibility.eligibleFrom
                ? selectedDate.isBefore(dayjs_1.default.tz(testEligibility.eligibleFrom), "date")
                : false,
            isAfterEligible: testEligibility.eligibleTo
                ? selectedDate.isAfter(dayjs_1.default.tz(testEligibility.eligibleTo), "date")
                : false,
            eligibleFromDate: testEligibility.eligibleFrom,
            testCentreName: selectedCentre.name,
            backLink: this.getBackLink(req),
            checkAnswersLink: this.getCheckAnswersLink(req),
            errors: req.errors,
        };
        return res.render("common/choose-appointment", renderParameters);
    }
    getTestEligibility(candidateEligibilities, testType) {
        const testEligibility = candidateEligibilities === null || candidateEligibilities === void 0 ? void 0 : candidateEligibilities.find((eligibility) => eligibility.testType === testType);
        if (!testEligibility) {
            throw Error("ChooseAppointmentController::getTestEligibility: No eligibility data found");
        }
        // Ignore eligibleFrom and eligibleTo for ERS instructor tests (needed for rescheduling)
        if (testEligibility.testType === enums_1.TestType.ERS) {
            testEligibility.eligibleFrom = undefined;
            testEligibility.eligibleTo = undefined;
        }
        return testEligibility;
    }
    splitIntoMorningAndAfternoonSlots(slotsByDate, selectedDate) {
        var _a;
        const slotsOnSelectedDate = (_a = slotsByDate[utc_date_1.toISODateString(selectedDate)]) !== null && _a !== void 0 ? _a : [];
        const midday = dayjs_1.default.tz(`${utc_date_1.toISODateString(selectedDate)}T12:00:00`); // Parse in local time
        const morningSlots = slotsOnSelectedDate.filter((slot) => dayjs_1.default(slot.startDateTime).tz().isBefore(midday.tz()));
        const afternoonSlots = slotsOnSelectedDate.filter((slot) => !dayjs_1.default(slot.startDateTime).tz().isBefore(midday.tz()));
        return { morningSlots, afternoonSlots };
    }
    storeKpiIdentifiersInSession(kpiIdentifiers, req) {
        if (kpiIdentifiers) {
            req.session.currentBooking = {
                ...req.session.currentBooking,
                ...kpiIdentifiers,
            };
        }
    }
    buildNavigation(selectedDate) {
        const weekView = this.appointmentService.getWeekViewDatesDesktop(selectedDate);
        const weekViewMobile = this.appointmentService.getWeekViewDatesMobile(selectedDate, weekView[0], weekView[6]);
        const navigation = {
            desktop: {
                previous: utc_date_1.toISODateString(selectedDate.subtract(7, "day")),
                next: utc_date_1.toISODateString(selectedDate.add(7, "day")),
            },
            mobile: {
                previous: this.appointmentService.getPreviousDateMobile(selectedDate),
                next: this.appointmentService.getNextDateMobile(selectedDate),
            },
        };
        return { weekView, weekViewMobile, navigation };
    }
    getBackLink(req) {
        if (!this.isManagedBookingSession(req)) {
            return "select-date";
        }
        if (!req.session.journey ||
            req.session.journey.managedBookingRescheduleChoice === undefined) {
            throw Error("ChooseAppointmentController::getBackLink: No journey set");
        }
        if (!req.session.currentBooking) {
            throw Error("ChooseAppointmentController::getBackLink: No currentBooking set");
        }
        // go back a page or go back to manage booking rescheduling choices
        const bookingReference = req.session.currentBooking.bookingRef;
        const backLink = req.session.journey.managedBookingRescheduleChoice.length &&
            req.url.startsWith(req.session.journey.managedBookingRescheduleChoice)
            ? `manage-change-location-time/${bookingReference}`
            : "select-date";
        return backLink;
    }
    getCheckAnswersLink(req) {
        if (this.isManagedBookingSession(req)) {
            return "/manage-booking/check-change";
        }
        return "check-your-answers";
    }
    getSelectTestCentreLink(req) {
        if (this.isManagedBookingSession(req)) {
            return "/manage-booking/select-test-centre";
        }
        return "select-test-centre";
    }
    isManagedBookingSession(req) {
        var _a;
        return Boolean((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.inManagedBookingEditMode);
    }
}
exports.ChooseAppointmentController = ChooseAppointmentController;
exports.default = new ChooseAppointmentController(new appointment_service_1.AppointmentService());
