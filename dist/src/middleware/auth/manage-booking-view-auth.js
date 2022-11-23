"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageBookingViewAuth = void 0;
const session_helper_1 = require("../../helpers/session-helper");
const session_1 = require("../../services/session");
const bookingRefExistsInLoadedBookings = (req, bookingReference) => {
    const booking = session_1.store.manageBooking.getBooking(req, bookingReference);
    return Boolean(booking);
};
const manageBookingViewAuth = (req, res, next) => {
    var _a;
    if (((_a = req.session.manageBooking) === null || _a === void 0 ? void 0 : _a.candidate) &&
        bookingRefExistsInLoadedBookings(req, req.params.ref || "")) {
        return next();
    }
    return res.redirect(session_helper_1.getTimeoutErrorPath(req));
};
exports.manageBookingViewAuth = manageBookingViewAuth;
