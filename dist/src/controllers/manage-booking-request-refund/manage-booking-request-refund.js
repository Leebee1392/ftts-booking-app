"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageBookingRequestRefundController = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const payment_gateway_1 = require("../../services/payments/payment-gateway");
const notifications_gateway_1 = require("../../services/notifications/notifications-gateway");
const logger_1 = require("../../helpers/logger");
const session_1 = require("../../services/session");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const builders_1 = require("../../services/notifications/content/builders");
const payment_helper_1 = require("../../services/payments/payment-helper");
const start_page_navigator_1 = require("../../helpers/start-page-navigator");
const eligibility_1 = require("../../domain/eligibility");
const maps_1 = require("../../services/crm-gateway/maps");
const booking_manager_1 = require("../../helpers/booking-manager");
class ManageBookingRequestRefundController {
    constructor(payments, notifications, crm, bookingManager) {
        this.payments = payments;
        this.notifications = notifications;
        this.crm = crm;
        this.bookingManager = bookingManager;
        this.get = (req, res) => this.renderRequestRefundLink(req, res);
        this.post = async (req, res) => {
            var _a;
            if (!((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.inManageBookingMode)) {
                throw Error("ManageBookingRequestRefundController::post: No session journey inManageBookingMode set");
            }
            if (!req.session.manageBooking) {
                throw Error("ManageBookingRequestRefundController::post: No session manageBooking set");
            }
            if (!req.session.manageBooking.candidate) {
                throw Error("ManageBookingRequestRefundController::post: No session candidate is set");
            }
            const { candidate } = req.session.manageBooking;
            const { bookingReference } = req.body;
            const { target, locale } = req.session;
            const booking = session_1.store.manageBooking.getBooking(req, bookingReference);
            if (!booking) {
                throw Error("ManageBookingRequestRefundController::post: No session booking is set");
            }
            try {
                await this.requestRefund(candidate, booking, target);
                if (candidate.email) {
                    await this.sendRefundRequestNotification(booking, candidate, target, locale);
                }
                else {
                    logger_1.logger.info("ManageBookingRequestRefundController::post: Candidate does not have an email set", {
                        bookingId: booking.details.bookingId,
                        bookingRef: booking.details.reference,
                        bookingProductId: booking.details.bookingProductId,
                        candidateId: candidate.candidateId,
                    });
                }
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingRequestRefundController::post: Couldn't request a refund", {
                    bookingId: booking.details.bookingId,
                    bookingRef: booking.details.reference,
                    bookingProductId: booking.details.bookingProductId,
                    candidateId: candidate.candidateId,
                });
                throw error;
            }
            await this.renderRefundConfirmationLink(booking, candidate, req, res);
        };
    }
    async requestRefund(candidate, booking, target) {
        logger_1.logger.info("ManageBookingRequestRefundController::requestRefund: Refund is being requested", {
            bookingId: booking.details.bookingId,
            bookingRef: booking.details.reference,
            bookingProductId: booking.details.bookingProductId,
            candidateId: candidate.candidateId,
        });
        if (!candidate.candidateId ||
            !candidate.personReference ||
            !candidate.address) {
            throw Error("ManageBookingRequestRefundController::requestRefund: Missing candidate id, person reference or address");
        }
        if (!booking.isCompensationTestEligible() || booking.isZeroCost()) {
            throw Error("ManageBookingRequestRefundController::requestRefund: Booking is not refundable");
        }
        const payload = payment_helper_1.buildPaymentRefundPayload(candidate, booking, target);
        await this.payments.requestRefund(payload, candidate.candidateId, candidate.personReference);
        await this.crm.updateCompensationBooking(booking.details.bookingId, dayjs_1.default().toISOString());
    }
    async sendRefundRequestNotification(booking, candidate, target, locale) {
        const bookingRef = booking.details.reference;
        const emailDetails = {
            bookingRef,
        };
        const emailContent = builders_1.buildRefundRequestEmailContent(emailDetails, target, locale);
        try {
            logger_1.logger.info("ManageBookingRequestRefundController::sendRefundRequestNotification: Attempting to send refund request email", {
                bookingId: booking.details.bookingId,
                bookingRef,
                bookingProductId: booking.details.bookingProductId,
                candidateId: candidate.candidateId,
            });
            await this.notifications.sendEmail(candidate.email, emailContent, bookingRef, target);
        }
        catch (error) {
            logger_1.logger.warn("ManageBookingRequestRefundController::sendRefundRequestNotification: Cannot send refund request confirmation email", {
                bookingId: booking.details.bookingId,
                bookingRef,
                bookingProductId: booking.details.bookingProductId,
                candidateId: candidate.candidateId,
                error,
            });
        }
    }
    renderRequestRefundLink(req, res) {
        var _a;
        const { ref } = req.query;
        const backLink = "../home";
        if (!ref) {
            logger_1.logger.warn("ManageBookingRequestRefundController::renderRequestRefundLink: Booking ref is empty in query params");
            res.redirect("/manage-booking/home");
            return;
        }
        const booking = session_1.store.manageBooking.getBooking(req, ref);
        if (!booking ||
            !booking.isCompensationTestEligible() ||
            booking.isZeroCost()) {
            logger_1.logger.warn("ManageBookingRequestRefundController::renderRequestRefundLink: booking was not found as a compensation test", {
                ref,
            });
            res.redirect("/manage-booking/home");
            return;
        }
        const isInstructorBooking = eligibility_1.INSTRUCTOR_TEST_TYPES.includes(maps_1.fromCRMProductNumber((_a = booking.details.product) === null || _a === void 0 ? void 0 : _a.productnumber));
        const bookTheoryTestLink = isInstructorBooking
            ? start_page_navigator_1.getInstructorBackLinkToStartPage(req)
            : start_page_navigator_1.getBackLinkToStartPage(req);
        res.render("manage-booking/request-refund", {
            backLink,
            bookingRef: ref,
            bookTheoryTestLink,
        });
    }
    async renderRefundConfirmationLink(booking, candidate, req, res) {
        var _a;
        const homeLink = "../home";
        const isInstructorBooking = eligibility_1.INSTRUCTOR_TEST_TYPES.includes(maps_1.fromCRMProductNumber((_a = booking.details.product) === null || _a === void 0 ? void 0 : _a.productnumber));
        const bookTheoryTestLink = isInstructorBooking
            ? start_page_navigator_1.getInstructorBackLinkToStartPage(req)
            : start_page_navigator_1.getBackLinkToStartPage(req);
        await this.bookingManager.loadCandidateBookings(req, candidate.candidateId);
        res.render("manage-booking/refund-confirmation", {
            bookingReference: booking.details.reference,
            homeLink,
            bookTheoryTestLink,
        });
    }
}
exports.ManageBookingRequestRefundController = ManageBookingRequestRefundController;
exports.default = new ManageBookingRequestRefundController(payment_gateway_1.paymentGateway, notifications_gateway_1.notificationsGateway, crm_gateway_1.CRMGateway.getInstance(), booking_manager_1.BookingManager.getInstance(crm_gateway_1.CRMGateway.getInstance()));
