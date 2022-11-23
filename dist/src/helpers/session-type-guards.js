"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidSessionCandidate = exports.isValidSessionBooking = void 0;
const isValidSessionBooking = (obj) => Boolean(obj &&
    obj.bookingId &&
    obj.bookingProductId &&
    obj.reservationId &&
    obj.bookingRef &&
    obj.bookingProductRef &&
    obj.dateTime &&
    obj.centre &&
    obj.testType);
exports.isValidSessionBooking = isValidSessionBooking;
const isValidSessionCandidate = (obj) => Boolean(obj && obj.candidateId && obj.email);
exports.isValidSessionCandidate = isValidSessionCandidate;
