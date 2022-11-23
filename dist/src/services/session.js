"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const uuid_1 = require("uuid");
const booking_1 = require("../domain/booking/booking");
const store = {
    manageBooking: {
        getBookings: (req) => {
            var _a, _b;
            const bookings = ((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.manageBooking) === null || _b === void 0 ? void 0 : _b.bookings) || [];
            return bookings.map((booking) => booking_1.Booking.from(booking));
        },
        getBooking: (req, bookingRef) => {
            var _a, _b;
            const bookings = ((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.manageBooking) === null || _b === void 0 ? void 0 : _b.bookings) || [];
            const bookingDetails = bookings.find((b) => b.reference === bookingRef);
            if (!bookingDetails) {
                return undefined;
            }
            return booking_1.Booking.from(bookingDetails);
        },
        updateBooking: (req, bookingRef, items) => {
            var _a, _b;
            const bookings = ((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.manageBooking) === null || _b === void 0 ? void 0 : _b.bookings) || [];
            const index = bookings.findIndex((b) => b.reference === bookingRef);
            // Safe here as not passing user input
            /* eslint-disable security/detect-object-injection */
            bookings[index] = {
                ...bookings[index],
                ...items,
            };
            return booking_1.Booking.from(bookings[index]);
            /* eslint-enable security/detect-object-injection */
        },
    },
    reset: (req, res) => {
        if (req.session) {
            req.session.journey = {
                inEditMode: false,
                inManagedBookingEditMode: false,
                managedBookingRescheduleChoice: "",
                inManageBookingMode: false,
                standardAccommodation: true,
                support: false,
            };
            req.session.candidate = undefined;
            req.session.currentBooking = undefined;
            req.session.testCentreSearch = undefined;
            req.session.testCentres = undefined;
            req.session.editedLocationTime = undefined;
            req.session.manageBooking = undefined;
            req.session.manageBookingEdits = undefined;
            req.session.priceLists = undefined;
            req.session.sessionId = uuid_1.v4();
            if (res === null || res === void 0 ? void 0 : res.locals) {
                res.locals.inEditMode = false;
                res.locals.inManagedBookingEditMode = false;
                res.locals.inManageBookingMode = false;
            }
        }
    },
    resetBooking: (req) => {
        if (req.session) {
            req.session.currentBooking = undefined;
            req.session.testCentreSearch = undefined;
            req.session.testCentres = undefined;
        }
    },
    resetBookingExceptSupportText: (req) => {
        if (req.session) {
            const oldBooking = req.session.currentBooking;
            req.session.currentBooking = {
                customSupport: oldBooking === null || oldBooking === void 0 ? void 0 : oldBooking.customSupport,
                preferredDay: oldBooking === null || oldBooking === void 0 ? void 0 : oldBooking.preferredDay,
                preferredDayOption: oldBooking === null || oldBooking === void 0 ? void 0 : oldBooking.preferredDayOption,
                preferredLocation: oldBooking === null || oldBooking === void 0 ? void 0 : oldBooking.preferredLocation,
                preferredLocationOption: oldBooking === null || oldBooking === void 0 ? void 0 : oldBooking.preferredLocationOption,
            };
            req.session.testCentreSearch = undefined;
            req.session.testCentres = undefined;
        }
    },
};
exports.store = store;
