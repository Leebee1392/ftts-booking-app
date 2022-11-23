"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageBookingHomeController = void 0;
const helpers_1 = require("../../helpers");
const session_1 = require("../../services/session");
const booking_1 = require("../../domain/booking/booking");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const booking_manager_1 = require("../../helpers/booking-manager");
const scheduling_gateway_1 = require("../../services/scheduling/scheduling-gateway");
const eligibility_1 = require("../../domain/eligibility");
const enums_1 = require("../../services/crm-gateway/enums");
const maps_1 = require("../../services/crm-gateway/maps");
const config_1 = __importDefault(require("../../config"));
const enums_2 = require("../../domain/enums");
class ManageBookingHomeController {
    constructor(bookingManager, scheduling) {
        this.bookingManager = bookingManager;
        this.scheduling = scheduling;
        this.get = async (req, res) => {
            if (!req.session.manageBooking) {
                throw new Error("ManageBookingHomeController::get: No Manage Booking Session");
            }
            const { candidate } = req.session.manageBooking;
            if (!(candidate === null || candidate === void 0 ? void 0 : candidate.candidateId)) {
                return res.redirect("login");
            }
            await this.bookingManager.loadCandidateBookings(req, candidate.candidateId);
            const bookings = session_1.store.manageBooking
                .getBookings(req)
                .filter((booking) => booking.isViewable())
                .sort(booking_1.byTestDateSoonestFirst);
            const { validBookings, bookingsWithErrors } = await this.findInvalidChangeInProgressBookings(bookings);
            const nsaBookingDetails = this.retrieveNsaBookingDetails(validBookings);
            const compensationEligibleNotificationLink = this.retrieveCompensationEligibleLink(validBookings, req.session.target);
            return res.render("manage-booking/home", {
                licenceNumber: candidate.licenceNumber,
                compensationEligibleNotificationLink,
                bookings: validBookings.map((booking) => booking.details),
                bookingsWithErrors: bookingsWithErrors.map((booking) => booking.details),
                nsaBookingDetails,
                heading: bookings.length
                    ? helpers_1.translate("manageBookingHome.header")
                    : helpers_1.translate("manageBookingHome.noBookings"),
                eligibleToBookOnline: candidate.eligibleToBookOnline,
                nsaFeatureToggle: config_1.default.featureToggles.enableViewNsaBookingSlots,
            });
        };
        /**
         * Find and split out any change in progress bookings that have been left in a bad state due to part of the
         * 'change in progress' process originally failing.  validBookings will contain all valid bookings, not just those
         * that are change in progress.
         */
        this.findInvalidChangeInProgressBookings = async (bookings) => {
            const changeInProgressBookings = bookings.filter((booking) => booking.isChangeInProgress());
            const statusOfChangeInProgressBookings = await Promise.all(changeInProgressBookings.map(this.validateChangeInProgressBooking));
            const bookingRefsWithErrors = statusOfChangeInProgressBookings
                .filter((booking) => booking.status === "ERROR")
                .map((booking) => booking.bookingRef);
            const validBookings = bookings.filter((booking) => !bookingRefsWithErrors.includes(booking.details.reference));
            const bookingsWithErrors = bookings.filter((booking) => bookingRefsWithErrors.includes(booking.details.reference));
            return {
                validBookings,
                bookingsWithErrors,
            };
        };
        this.validateChangeInProgressBooking = async (changeInProgressBooking) => {
            const { reference: bookingRef, bookingProductRef, testCentre, } = changeInProgressBooking.details;
            try {
                const booking = await this.scheduling.getBooking(bookingProductRef, testCentre.region);
                if (booking) {
                    return {
                        bookingRef,
                        status: "OK",
                    };
                }
            }
            catch (e) {
                helpers_1.logger.error(e, `Booking ${bookingRef} cannot be retrieved from TCN`, {
                    bookingRef,
                });
            }
            return {
                bookingRef,
                status: "ERROR",
            };
        };
    }
    retrieveCompensationEligibleLink(bookings, target) {
        var _a;
        const compensationEligibleBookings = bookings.filter((booking) => booking.isCompensationTestEligible());
        if (compensationEligibleBookings.length <= 0) {
            return "";
        }
        if (compensationEligibleBookings.length > 1 &&
            this.isBookingTypeMixed(compensationEligibleBookings)) {
            if (target === enums_2.Target.GB) {
                return `${config_1.default.landing.gb.citizen.book}`;
            }
            return `${config_1.default.landing.ni.citizen.compensationBook}`;
        }
        const isInstructorBooking = eligibility_1.INSTRUCTOR_TEST_TYPES.includes(maps_1.fromCRMProductNumber((_a = compensationEligibleBookings[0].details.product) === null || _a === void 0 ? void 0 : _a.productnumber));
        return isInstructorBooking ? "/instructor" : "/";
    }
    isBookingTypeMixed(bookings) {
        const instructorBookings = bookings.filter((booking) => {
            var _a;
            return eligibility_1.INSTRUCTOR_TEST_TYPES.includes(maps_1.fromCRMProductNumber((_a = booking.details.product) === null || _a === void 0 ? void 0 : _a.productnumber));
        });
        return !(instructorBookings.length === bookings.length ||
            instructorBookings.length === 0);
    }
    retrieveNsaBookingDetails(bookings) {
        let nsaBookingDetails = [];
        const checkValidNsaBookingSlots = (nsaBookingSlots) => nsaBookingSlots.ftts_status === enums_1.CRMNsaBookingSlotStatus.Offered;
        nsaBookingDetails = bookings
            .filter((booking) => {
            const bookingDetails = booking.details;
            return (bookingDetails.nsaStatus &&
                bookingDetails.nsaStatus ===
                    enums_1.CRMNsaStatus.AwaitingCandidateSlotConfirmation);
        })
            .map((booking) => {
            var _a;
            const bookingDetails = booking.details;
            const canViewSlots = ((_a = bookingDetails.nsaBookingSlots) === null || _a === void 0 ? void 0 : _a.filter(checkValidNsaBookingSlots).length) === 3 &&
                bookingDetails.nsaStatus ===
                    enums_1.CRMNsaStatus.AwaitingCandidateSlotConfirmation; // NSA status needed to allow viewing of slots
            return {
                bookingId: bookingDetails.bookingId,
                nsaStatus: helpers_1.mapCRMNsaStatusToNSAStatus(bookingDetails.nsaStatus),
                canViewSlots,
            };
        });
        return nsaBookingDetails;
    }
}
exports.ManageBookingHomeController = ManageBookingHomeController;
exports.default = new ManageBookingHomeController(booking_manager_1.BookingManager.getInstance(crm_gateway_1.CRMGateway.getInstance()), scheduling_gateway_1.SchedulingGateway.getInstance());
