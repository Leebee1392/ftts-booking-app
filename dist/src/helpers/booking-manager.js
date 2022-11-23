"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingManager = void 0;
const enums_1 = require("../domain/enums");
const enums_2 = require("../services/crm-gateway/enums");
class BookingManager {
    constructor(crm) {
        this.crm = crm;
        this.agencyMatchesTarget = (agency, target) => agency in enums_2.CRMGovernmentAgency &&
            ((agency === enums_2.CRMGovernmentAgency.Dva && target === enums_1.Target.NI) ||
                (agency === enums_2.CRMGovernmentAgency.Dvsa && target === enums_1.Target.GB));
    }
    static getInstance(crm) {
        if (!BookingManager.instance) {
            BookingManager.instance = new BookingManager(crm);
        }
        return BookingManager.instance;
    }
    async loadCandidateBookings(req, candidateId) {
        var _a;
        const allBookings = await this.crm.getCandidateBookings(candidateId);
        const target = (_a = req.session.target) !== null && _a !== void 0 ? _a : enums_1.Target.GB;
        const bookings = allBookings.filter((booking) => this.agencyMatchesTarget(booking.governmentAgency, target));
        req.session.manageBooking = {
            ...req.session.manageBooking,
            bookings,
        };
        return bookings;
    }
}
exports.BookingManager = BookingManager;
