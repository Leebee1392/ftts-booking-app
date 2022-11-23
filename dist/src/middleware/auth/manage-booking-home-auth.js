"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageBookingHomeAuth = void 0;
const session_helper_1 = require("../../helpers/session-helper");
const manageBookingHomeAuth = (req, res, next) => {
    var _a;
    if ((_a = req.session.manageBooking) === null || _a === void 0 ? void 0 : _a.candidate) {
        return next();
    }
    return res.redirect(session_helper_1.getTimeoutErrorPath(req));
};
exports.manageBookingHomeAuth = manageBookingHomeAuth;
