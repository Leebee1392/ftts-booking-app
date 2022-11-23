"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = void 0;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["SUCCESS"] = 801] = "SUCCESS";
    PaymentStatus[PaymentStatus["FAILED"] = 802] = "FAILED";
    PaymentStatus[PaymentStatus["USER_CANCELLED"] = 807] = "USER_CANCELLED";
    // Refund
    PaymentStatus[PaymentStatus["REFUND_SUCCESS"] = 809] = "REFUND_SUCCESS";
    // Gateway error
    PaymentStatus[PaymentStatus["GATEWAY_ERROR"] = 810] = "GATEWAY_ERROR";
    // System Error
    PaymentStatus[PaymentStatus["SYSTEM_ERROR"] = 828] = "SYSTEM_ERROR";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
