"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingHandler = void 0;
const enums_1 = require("../services/crm-gateway/enums");
const logger_1 = require("./logger");
const payment_helper_1 = require("../services/payments/payment-helper");
const enums_2 = require("../domain/enums");
const config_1 = __importDefault(require("../config"));
class BookingHandler {
    constructor(crmGateway, req, scheduling) {
        var _a;
        this.crmGateway = crmGateway;
        this.req = req;
        this.scheduling = scheduling;
        if (!req.session.candidate) {
            throw Error("BookingHandler::constructor: No candidate set");
        }
        if (!req.session.currentBooking) {
            throw Error("BookingHandler::constructor: No currentBooking set");
        }
        if (!req.session.journey ||
            req.session.journey.standardAccommodation === undefined) {
            throw Error("BookingHandler::constructor: No journey set");
        }
        this.candidate = req.session.candidate;
        this.booking = req.session.currentBooking;
        this.isStandardAccommodation = (_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.standardAccommodation;
    }
    async createBooking() {
        await this.reserveBooking();
        await this.createEntities();
    }
    async reserveBooking() {
        if (this.isStandardAccommodation && this.scheduling) {
            if (!this.booking.centre ||
                !this.booking.testType ||
                !this.booking.dateTime) {
                throw Error("BookingHandler::reserveBooking: No booking params set");
            }
            const { reservationId } = await this.scheduling.reserveSlot(this.booking.centre, this.booking.testType, this.booking.dateTime);
            this.req.session.currentBooking = {
                ...this.req.session.currentBooking,
                reservationId,
            };
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_RESERVATION_SUCCESS, "BookingHandler::reserveBooking: Successfully reserved a slot for the booking", {
                reservationId,
                candidateId: this.candidate.candidateId,
                licenceId: this.candidate.licenceId,
                testCentre: this.booking.centre,
                dateTime: this.booking.dateTime,
                testType: this.booking.testType,
            });
            logger_1.logger.info("BookingHandler::reserveBooking: Reservation was made", {
                reservationId,
                bookingId: this.booking.bookingId,
            });
        }
    }
    async createEntities() {
        logger_1.logger.debug("BookingHandler::createEntities: Attempting to create entities", { bookingId: this.booking.bookingId });
        if (!this.candidate.licenceNumber || !this.booking.testType) {
            throw Error("BookingHandler::createEntities: No booking params set");
        }
        const priceListId = this.req.session.target === enums_2.Target.NI
            ? config_1.default.crm.priceListId.dva
            : config_1.default.crm.priceListId.dvsa;
        const candidateAndBookingResponse = await this.crmGateway.updateCandidateAndCreateBooking(this.candidate, this.booking, this.getAdditionalSupport(), this.isStandardAccommodation, priceListId);
        if (this.isStandardAccommodation) {
            this.booking.salesReference = payment_helper_1.buildPaymentReference(27);
        }
        const bookingProductId = await this.crmGateway.createBookingProduct(this.candidate, this.booking, candidateAndBookingResponse.booking, this.isStandardAccommodation, this.getAdditionalSupport());
        this.req.session.currentBooking = {
            ...this.req.session.currentBooking,
            bookingRef: candidateAndBookingResponse.booking.reference,
            bookingProductRef: `${candidateAndBookingResponse.booking.reference}-01`,
            bookingId: candidateAndBookingResponse.booking.id,
            bookingProductId,
            salesReference: this.booking.salesReference,
        };
    }
    getAdditionalSupport() {
        const { currentBooking } = this.req.session;
        if (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.bsl) {
            return enums_1.CRMAdditionalSupport.BritishSignLanguage;
        }
        if ((currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.voiceover) &&
            (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.voiceover) === enums_2.Voiceover.WELSH) {
            return enums_1.CRMAdditionalSupport.VoiceoverWelsh;
        }
        if ((currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.voiceover) &&
            (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.voiceover) === enums_2.Voiceover.ENGLISH) {
            return enums_1.CRMAdditionalSupport.VoiceoverEnglish;
        }
        return enums_1.CRMAdditionalSupport.None;
    }
}
exports.BookingHandler = BookingHandler;
