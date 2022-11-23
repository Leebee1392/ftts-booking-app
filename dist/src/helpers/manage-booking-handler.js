"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setManageBookingEditMode = void 0;
const session_1 = require("../services/session");
const session_helper_1 = require("./session-helper");
const setManageBookingEditMode = (req) => {
    if (!req.session.journey) {
        throw Error("setManageBookingEditMode:: No journey set");
    }
    req.session.journey.inManagedBookingEditMode = true;
    const booking = session_1.store.manageBooking.getBooking(req, req.params.ref);
    if (booking) {
        const sessionBooking = session_helper_1.mapBookingEntityToSessionBooking(booking);
        req.session.currentBooking = {
            ...req.session.currentBooking,
            ...sessionBooking,
        };
    }
    req.session.testCentreSearch = undefined;
};
exports.setManageBookingEditMode = setManageBookingEditMode;
