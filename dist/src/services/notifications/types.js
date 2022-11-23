"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailType = void 0;
var EmailType;
(function (EmailType) {
    EmailType[EmailType["BOOKING_CONFIRMATION"] = 0] = "BOOKING_CONFIRMATION";
    EmailType[EmailType["BOOKING_CANCELLATION"] = 1] = "BOOKING_CANCELLATION";
    EmailType[EmailType["BOOKING_RESCHEDULED"] = 2] = "BOOKING_RESCHEDULED";
    EmailType[EmailType["EVIDENCE_REQUIRED"] = 3] = "EVIDENCE_REQUIRED";
    EmailType[EmailType["EVIDENCE_NOT_REQUIRED"] = 4] = "EVIDENCE_NOT_REQUIRED";
    EmailType[EmailType["EVIDENCE_MAY_BE_REQUIRED"] = 5] = "EVIDENCE_MAY_BE_REQUIRED";
    EmailType[EmailType["RETURNING_CANDIDATE"] = 6] = "RETURNING_CANDIDATE";
    EmailType[EmailType["REFUND_REQUEST"] = 7] = "REFUND_REQUEST";
})(EmailType = exports.EmailType || (exports.EmailType = {}));
