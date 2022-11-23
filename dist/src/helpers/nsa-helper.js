"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNsaDraftBooking = void 0;
const enums_1 = require("../services/crm-gateway/enums");
const isNsaDraftBooking = (b) => Boolean(b.ftts_bookingstatus === enums_1.CRMBookingStatus.Draft &&
    b.ftts_bookingid.ftts_nonstandardaccommodation);
exports.isNsaDraftBooking = isNsaDraftBooking;
