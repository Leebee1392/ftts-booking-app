"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageBookingCancelController = void 0;
const eligibility_1 = require("../../domain/eligibility");
const enums_1 = require("../../domain/enums");
const logger_1 = require("../../helpers/logger");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const enums_2 = require("../../services/crm-gateway/enums");
const maps_1 = require("../../services/crm-gateway/maps");
const builders_1 = require("../../services/notifications/content/builders");
const notifications_gateway_1 = require("../../services/notifications/notifications-gateway");
const enums_3 = require("../../services/payments/enums");
const payment_gateway_1 = require("../../services/payments/payment-gateway");
const payment_helper_1 = require("../../services/payments/payment-helper");
const scheduling_gateway_1 = require("../../services/scheduling/scheduling-gateway");
const session_1 = require("../../services/session");
const booking_manager_1 = require("../../helpers/booking-manager");
class ManageBookingCancelController {
    constructor(schedulingGateway, crmGateway, notifications, paymentClient, bookingManager) {
        this.schedulingGateway = schedulingGateway;
        this.crmGateway = crmGateway;
        this.notifications = notifications;
        this.paymentClient = paymentClient;
        this.bookingManager = bookingManager;
        this.get = (req, res) => {
            if (!req.session.manageBooking) {
                logger_1.logger.warn("ManageBookingCancelController::get: No session manageBooking set");
                return res.redirect("../login");
            }
            const { candidate } = req.session.manageBooking;
            const bookingReference = req.params.ref;
            const booking = session_1.store.manageBooking.getBooking(req, bookingReference);
            if (!candidate || !booking || !booking.canBeCancelled()) {
                return res.redirect("../login");
            }
            return res.render("manage-booking/cancel", {
                booking: booking.details,
            });
        };
        this.post = async (req, res) => {
            var _a;
            if (!req.session.manageBooking) {
                throw Error("ManageBookingCancelController::post: No session manageBooking set");
            }
            const { candidate } = req.session.manageBooking;
            const target = req.session.target || enums_1.Target.GB;
            const lang = req.session.locale || enums_1.Locale.GB;
            const bookingReference = req.params.ref;
            const booking = session_1.store.manageBooking.getBooking(req, bookingReference);
            if (!(candidate === null || candidate === void 0 ? void 0 : candidate.candidateId) ||
                !booking ||
                !booking.canBeCancelled() ||
                !candidate.eligibleToBookOnline) {
                return res.redirect("../login");
            }
            try {
                await this.setCancelInProgressInCRM(booking);
                const testType = maps_1.fromCRMProductNumber((_a = booking.details.product) === null || _a === void 0 ? void 0 : _a.productnumber);
                if (!eligibility_1.isZeroCostTest(testType)) {
                    await this.handlePayment(booking, candidate, target);
                }
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCancelController::post: Cancelling failed", { bookingReference });
                await this.bookingManager.loadCandidateBookings(req, candidate.candidateId);
                return res.render("manage-booking/cancel-error", {
                    bookingRef: booking.details.reference,
                });
            }
            await this.deleteScheduledSlot(booking);
            await this.cancelBookingInCRM(booking);
            await this.sendCancellationEmail(booking, candidate, target, lang);
            await this.bookingManager.loadCandidateBookings(req, candidate.candidateId);
            return res.render("manage-booking/cancel-confirmation", {
                licenceNumber: candidate === null || candidate === void 0 ? void 0 : candidate.licenceNumber,
                booking: booking === null || booking === void 0 ? void 0 : booking.details,
            });
        };
        this.setCancelInProgressInCRM = async (booking) => {
            var _a;
            try {
                logger_1.logger.info("ManageBookingCancelController::setCancelInProgressInCRM: Attempting to set booking status of Cancellation in Progress", {
                    bookingRef: booking.details.reference,
                });
                return await this.crmGateway.updateBookingStatus(booking.details.bookingId, enums_2.CRMBookingStatus.CancellationInProgress, ((_a = booking === null || booking === void 0 ? void 0 : booking.details) === null || _a === void 0 ? void 0 : _a.origin) === enums_2.CRMOrigin.CustomerServiceCentre);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCancelController::setCancelInProgressInCRM: Failed to set status of Cancellation in Progress in CRM after 3 retries", {
                    bookingRef: booking.details.reference,
                });
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CANCEL, "ManageBookingCancelController::setCancelInProgressInCRM: Failed to set status of Cancellation in Progress in CRM after 3 retries", {
                    error,
                    bookingRef: booking.details.reference,
                });
                throw error;
            }
        };
        this.handlePayment = async (booking, candidate, target) => {
            var _a, _b;
            if (!candidate.address || !candidate.personReference) {
                throw new Error("ManageBookingCancelController::handlePayment: Missing required candidate session data");
            }
            if (booking.isRefundable()) {
                const payload = payment_helper_1.buildPaymentRefundPayload(candidate, booking, target);
                logger_1.logger.info("ManageBookingCancelController::handlePayment: Attempting to request refund", {
                    candidateId: candidate.candidateId,
                });
                logger_1.logger.debug("ManageBookingCancelController::handlePayment: Refund payload:", {
                    payload,
                });
                try {
                    const response = await this.paymentClient.requestRefund(payload, candidate.candidateId, candidate.personReference);
                    if ((response === null || response === void 0 ? void 0 : response.code) &&
                        Number(response.code) !== enums_3.PaymentStatus.REFUND_SUCCESS) {
                        logger_1.logger.warn("ManageBookingCancelController::handlePayment: Refund failed - Payment status NOT success", {
                            bookingRef: booking.details.reference,
                            cpmsCode: response.code,
                            cpmsMessage: response.message,
                            bookingId: booking.details.bookingId,
                            bookingProductId: booking.details.bookingProductId,
                            candidateId: candidate.candidateId,
                            licenceId: candidate.licenceId,
                        });
                    }
                }
                catch (error) {
                    const errorCode = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.code;
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_REFUND_FAIL, "ManageBookingCancelController::handlePayment: Refund attempt failed", {
                        error,
                        candidateId: candidate.candidateId,
                        personReference: candidate.personReference,
                        cpmsCode: errorCode,
                    });
                    throw error;
                }
            }
            else {
                logger_1.logger.info("ManageBookingCancelController::handlePayment: Attempting to recognise income", {
                    candidateId: candidate.candidateId,
                    bookingProductId: booking.details.bookingProductId,
                });
                try {
                    await this.paymentClient.recogniseIncome({
                        bookingProductId: booking.details.bookingProductId,
                    }, candidate.candidateId, candidate.personReference);
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_INCOME_SUCCESS, "ManageBookingCancelController::handlePayment: Income recognised", {
                        bookingProductId: booking.details.bookingProductId,
                        candidateId: candidate.candidateId,
                        personReference: candidate.personReference,
                    });
                }
                catch (error) {
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_INCOME_FAIL, "ManageBookingCancelController::handlePayment: Income recognition failure", {
                        error,
                        bookingProductId: booking.details.bookingProductId,
                        candidateId: candidate.candidateId,
                        personReference: candidate.personReference,
                    });
                    throw error;
                }
            }
        };
        this.cancelBookingInCRM = async (booking) => {
            var _a;
            try {
                logger_1.logger.info("ManageBookingCancelController::cancelBookingInCRM: Cancelling booking in CRM", {
                    reference: booking.details.reference,
                });
                await this.crmGateway.markBookingCancelled(booking.details.bookingId, booking.details.bookingProductId, ((_a = booking === null || booking === void 0 ? void 0 : booking.details) === null || _a === void 0 ? void 0 : _a.origin) === enums_2.CRMOrigin.CustomerServiceCentre);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCancelController::cancelBookingInCRM: Cancelling booking in CRM failed", {
                    reference: booking.details.reference,
                });
            }
        };
        this.deleteScheduledSlot = async (booking) => {
            try {
                await this.schedulingGateway.deleteBooking(booking.details.bookingProductRef, booking.details.testCentre.region);
                await this.crmGateway.updateTCNUpdateDate(booking.details.bookingProductId);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCancelController::deleteScheduledSlot: Unable to successfully delete scheduled slot", {
                    reference: booking.details.reference,
                });
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_FAIL_CONFIRM_CANCEL, "ManageBookingCancelController::deleteScheduledSlot: Failed to cancel slot while cancelling a booking with the Scheduling API", {
                    error,
                    reference: booking.details.reference,
                });
            }
        };
        this.sendCancellationEmail = async (booking, candidate, target, lang) => {
            var _a;
            try {
                const { email } = candidate;
                logger_1.logger.info("ManageBookingCancelController::sendCancellationEmail: Sending cancellation email", {
                    bookingProductRef: booking.details.bookingProductRef,
                });
                const bookingCancellationDetails = {
                    bookingRef: booking.details.reference,
                    testType: maps_1.fromCRMProductNumber((_a = booking.details.product) === null || _a === void 0 ? void 0 : _a.productnumber),
                    testDateTime: booking.details.testDate,
                };
                const emailContent = builders_1.buildBookingCancellationEmailContent(bookingCancellationDetails, target, lang);
                await this.notifications.sendEmail(email, emailContent, booking.details.reference, target);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCancelController::sendCancellationEmail: Could not send booking cancellation email", {
                    candidateId: candidate.candidateId,
                });
            }
        };
    }
}
exports.ManageBookingCancelController = ManageBookingCancelController;
exports.default = new ManageBookingCancelController(scheduling_gateway_1.SchedulingGateway.getInstance(), crm_gateway_1.CRMGateway.getInstance(), notifications_gateway_1.notificationsGateway, payment_gateway_1.paymentGateway, booking_manager_1.BookingManager.getInstance(crm_gateway_1.CRMGateway.getInstance()));
