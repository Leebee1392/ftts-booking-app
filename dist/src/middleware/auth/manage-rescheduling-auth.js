"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageReschedulingAuth = void 0;
const session_helper_1 = require("../../helpers/session-helper");
const session_1 = require("../../services/session");
const bookingRefExistsInLoadedBookings = (req, bookingReference) => {
    const booking = session_1.store.manageBooking.getBooking(req, bookingReference);
    return Boolean(booking);
};
const manageReschedulingAuth = (req, res, next) => {
    var _a, _b, _c;
    if (((_a = req.session.manageBooking) === null || _a === void 0 ? void 0 : _a.candidate) &&
        req.session.currentBooking &&
        ((_b = req.session.journey) === null || _b === void 0 ? void 0 : _b.inManagedBookingEditMode) &&
        bookingRefExistsInLoadedBookings(req, ((_c = req.session.currentBooking) === null || _c === void 0 ? void 0 : _c.bookingRef) || "")) {
        return next();
    }
    return res.redirect(session_helper_1.getTimeoutErrorPath(req));
};
exports.manageReschedulingAuth = manageReschedulingAuth;
