"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatedBookingIdentifiers = void 0;
const getCreatedBookingIdentifiers = (req) => {
    if (!(req === null || req === void 0 ? void 0 : req.session)) {
        return {};
    }
    const { currentBooking: booking, candidate } = req.session;
    return {
        bookingId: booking === null || booking === void 0 ? void 0 : booking.bookingId,
        bookingRef: booking === null || booking === void 0 ? void 0 : booking.bookingRef,
        bookingProductId: booking === null || booking === void 0 ? void 0 : booking.bookingProductId,
        bookingProductRef: booking === null || booking === void 0 ? void 0 : booking.bookingProductRef,
        candidateId: candidate === null || candidate === void 0 ? void 0 : candidate.candidateId,
        licenceId: candidate === null || candidate === void 0 ? void 0 : candidate.licenceId,
    };
};
exports.getCreatedBookingIdentifiers = getCreatedBookingIdentifiers;
