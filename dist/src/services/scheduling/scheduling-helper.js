"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSlotsKpis = void 0;
const hasSlotsKpis = (booking) => booking.dateAvailableOnOrAfterPreferredDate !== undefined &&
    booking.dateAvailableOnOrAfterToday !== undefined &&
    booking.dateAvailableOnOrBeforePreferredDate !== undefined;
exports.hasSlotsKpis = hasSlotsKpis;
