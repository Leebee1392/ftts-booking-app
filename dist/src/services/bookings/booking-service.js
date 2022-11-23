"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const eligibility_1 = require("../../domain/eligibility");
const crm_1 = require("../../domain/errors/crm");
const logger_1 = require("../../helpers/logger");
const crm_gateway_1 = require("../crm-gateway/crm-gateway");
const enums_1 = require("../crm-gateway/enums");
const scheduling_gateway_1 = require("../scheduling/scheduling-gateway");
class BookingService {
    constructor(scheduling, crmGateway) {
        this.scheduling = scheduling;
        this.crmGateway = crmGateway;
    }
    static getInstance() {
        if (!BookingService.instance) {
            BookingService.instance = new BookingService(scheduling_gateway_1.SchedulingGateway.getInstance(), crm_gateway_1.CRMGateway.getInstance());
        }
        return BookingService.instance;
    }
    /**
     * Completes a booking, confirming the slot, updating its booking status and setting the TCN Update Date on the associated booking product
     * @param candidate an object containing behavioural marker properties (which can be undefined)
     * @param booking a **pre-validated** booking object to ensure _all required properties are present and set_
     * @returns an object with a boolean isConfirmed flag and the booking reference if slot confirmation unsuccessful, or the last refund date if successful
     */
    async completeBooking(candidate, booking, paymentId) {
        var _a, _b, _c, _d, _e, _f, _g;
        const { bookingId, bookingProductId, reservationId, bookingRef, bookingProductRef, dateTime, centre, } = booking;
        const businessIdentifiers = {
            bookingId,
            bookingProductId,
            reservationId,
        };
        try {
            await this.scheduling.confirmBooking([
                {
                    bookingReferenceId: bookingProductRef,
                    reservationId,
                    notes: "",
                    behaviouralMarkers: eligibility_1.hasBehaviouralMarkerForTest(dateTime, candidate.behaviouralMarker, candidate.behaviouralMarkerExpiryDate)
                        ? eligibility_1.behaviouralMarkerLabel
                        : "",
                },
            ], centre.region);
        }
        catch (error) {
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 || ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 403) {
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_AUTH_ISSUE, "BookingService::completeBooking: Failed to authenticate to the scheduling api", {
                    ...businessIdentifiers,
                });
            }
            else if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) >= 400 &&
                ((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) < 500) {
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_REQUEST_ISSUE, `BookingService::completeBooking: Scheduling API did not accept request ${(_e = error.response) === null || _e === void 0 ? void 0 : _e.status}`, {
                    ...businessIdentifiers,
                });
            }
            else if (((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) >= 500) {
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_ERROR, `BookingService::completeBooking: Scheduling API returned error response ${(_g = error.response) === null || _g === void 0 ? void 0 : _g.status}`, {
                    ...businessIdentifiers,
                });
            }
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_FAIL_CONFIRM_NEW, "BookingService::completeBooking: Failed to confirm new slot to make the booking with Scheduling API", {
                ...businessIdentifiers,
            });
            logger_1.logger.error(error, "BookingService::completeBooking: Error confirming booking slot with scheduling", {
                bookingRef,
                ...businessIdentifiers,
            });
            await this.unreserveBooking(bookingProductRef, centre.region, bookingProductId, bookingId, reservationId, enums_1.CRMBookingStatus.Draft);
            return { isConfirmed: false, bookingRef };
        }
        let lastRefundDate;
        try {
            await this.crmGateway.updateBookingStatusPaymentStatusAndTCNUpdateDate(bookingId, bookingProductId, enums_1.CRMBookingStatus.Confirmed, paymentId, false);
            lastRefundDate = await this.crmGateway.calculateThreeWorkingDays(dateTime, centre.remit);
            logger_1.logger.info("BookingService::completeBooking: booking confirmed", {
                ...businessIdentifiers,
                lastRefundDate,
            });
        }
        catch (error) {
            throw new crm_1.CrmServerError();
        }
        return { isConfirmed: true, lastRefundDate };
    }
    async unreserveBooking(bookingProductRef, region, bookingProductId, bookingId, reservationId, bookingStatus, paymentId) {
        const businessIdentifiers = {
            bookingProductRef,
            bookingProductId,
            bookingId,
        };
        try {
            await this.scheduling.deleteReservation(reservationId, region, bookingProductRef); // We want to still update booking status to draft if this fails
        }
        catch (error) {
            logger_1.logger.warn("BookingService::unreserveBooking: Error when deleting reservation", {
                error,
                ...businessIdentifiers,
            });
        }
        await this.crmGateway.updateBookingStatusPaymentStatusAndTCNUpdateDate(bookingId, bookingProductId, bookingStatus, paymentId);
        logger_1.logger.info("BookingService::unreserveBooking: booking unreserved", {
            ...businessIdentifiers,
        });
    }
}
exports.BookingService = BookingService;
