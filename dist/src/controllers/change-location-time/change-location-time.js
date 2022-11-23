"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeLocationTime = void 0;
const language_1 = require("../../helpers/language");
const enums_1 = require("../../domain/enums");
const session_1 = require("../../services/session");
const manage_booking_handler_1 = require("../../helpers/manage-booking-handler");
const utc_date_1 = require("../../domain/utc-date");
class ChangeLocationTime {
    constructor() {
        this.get = (req, res) => {
            var _a;
            if ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.inManagedBookingEditMode) {
                req.session.manageBookingEdits = undefined;
            }
            this.renderPage(req, res);
        };
        this.post = (req, res) => {
            if (req.hasErrors) {
                return this.renderPage(req, res);
            }
            let booking;
            if (this.isManageBookingSession(req)) {
                booking = session_1.store.manageBooking.getBooking(req, req.params.ref);
                manage_booking_handler_1.setManageBookingEditMode(req);
            }
            else {
                req.session.journey = {
                    ...req.session.journey,
                    inEditMode: true,
                };
            }
            const { changeLocationOrTime } = req.body;
            switch (changeLocationOrTime) {
                case enums_1.ChangeLocationTimeOptions.TIME_ONLY:
                    return this.gotoChooseAppointment(req, res, booking);
                case enums_1.ChangeLocationTimeOptions.TIME_AND_DATE:
                    return this.gotoSelectDate(req, res);
                case enums_1.ChangeLocationTimeOptions.LOCATION:
                    return this.gotoFindTestCentre(req, res);
                default:
            }
            return res.redirect(this.getCheckAnswersLink(req));
        };
        this.postSchema = {
            changeLocationOrTime: {
                in: ["body"],
                isEmpty: {
                    errorMessage: () => language_1.translate("changeLocationTime.validationError"),
                    negated: true,
                },
            },
        };
        this.renderPage = (req, res) => {
            res.render("change-location-time", {
                options: this.buildRadioButtonItems(),
                errors: req.errors,
                checkAnswersLink: this.getCheckAnswersLink(req),
            });
        };
    }
    buildRadioButtonItems() {
        return Object.values(enums_1.ChangeLocationTimeOptions).map((option) => ({
            value: option,
            text: language_1.translate(`changeLocationTime.${option}.label`),
            label: {
                classes: "govuk-label--s",
            },
            hint: {
                text: language_1.translate(`changeLocationTime.${option}.hint`),
            },
            checked: false,
        }));
    }
    isManageBookingSession(req) {
        return req.url.startsWith("/manage-change-location-time");
    }
    getCheckAnswersLink(req) {
        if (this.isManageBookingSession(req)) {
            return `/manage-booking/${req.params.ref}`;
        }
        return "check-your-answers";
    }
    gotoChooseAppointment(req, res, booking) {
        if (this.isManageBookingSession(req)) {
            req.session.journey = {
                ...req.session.journey,
                managedBookingRescheduleChoice: "/choose-appointment",
            };
            const isoDateTime = utc_date_1.toISODateString(booking.details.testDate);
            return res.redirect(`/manage-booking/choose-appointment?selectedDate=${isoDateTime}`);
        }
        return res.redirect("/choose-appointment");
    }
    gotoSelectDate(req, res) {
        if (this.isManageBookingSession(req)) {
            req.session.journey = {
                ...req.session.journey,
                managedBookingRescheduleChoice: "/select-date",
            };
            return res.redirect("/manage-booking/select-date");
        }
        return res.redirect("/select-date");
    }
    gotoFindTestCentre(req, res) {
        if (this.isManageBookingSession(req)) {
            req.session.journey = {
                ...req.session.journey,
                managedBookingRescheduleChoice: "/find-test-centre",
            };
            return res.redirect("/manage-booking/find-test-centre");
        }
        return res.redirect("/find-test-centre");
    }
}
exports.ChangeLocationTime = ChangeLocationTime;
exports.default = new ChangeLocationTime();
