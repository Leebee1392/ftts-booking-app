"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRedirect = void 0;
const logger_1 = require("../helpers/logger");
const paymentRedirect = (req, res, next) => {
    var _a, _b, _c;
    if (!((_b = (_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.currentBooking) === null || _b === void 0 ? void 0 : _b.bookingRef)) {
        logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_REDIRECT_SESSION_FAIL, "paymentRedirect: Redirected back to an invalid or expired session from payments", { bookingReference: (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.bookingReference });
    }
    return next();
};
exports.paymentRedirect = paymentRedirect;
