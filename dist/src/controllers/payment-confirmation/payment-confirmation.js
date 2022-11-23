"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentConfirmationController = void 0;
const eligibility_1 = require("../../domain/eligibility");
const enums_1 = require("../../domain/enums");
const crm_1 = require("../../domain/errors/crm");
const PaymentConfirmationError_1 = require("../../domain/errors/PaymentConfirmationError");
const PaymentSystemError_1 = require("../../domain/errors/PaymentSystemError");
const PaymentUnsuccessfulError_1 = require("../../domain/errors/PaymentUnsuccessfulError");
const PaymentUserCancelledError_1 = require("../../domain/errors/PaymentUserCancelledError");
const index_1 = require("../../helpers/index");
const booking_service_1 = require("../../services/bookings/booking-service");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const enums_2 = require("../../services/crm-gateway/enums");
const builders_1 = require("../../services/notifications/content/builders");
const notifications_gateway_1 = require("../../services/notifications/notifications-gateway");
const enums_3 = require("../../services/payments/enums");
const payment_gateway_1 = require("../../services/payments/payment-gateway");
const session_1 = require("../../services/session");
class PaymentConfirmationController {
    constructor(notifications, bookingService, payments, crmGateway) {
        this.notifications = notifications;
        this.bookingService = bookingService;
        this.payments = payments;
        this.crmGateway = crmGateway;
        this.get = async (req, res) => {
            var _a, _b;
            index_1.logger.event(index_1.BusinessTelemetryEvents.PAYMENT_BACK, "PaymentConfirmationController::get: User returned from payment");
            if (!index_1.isValidSessionBooking(req.session.currentBooking) ||
                !index_1.isValidSessionCandidate(req.session.candidate)) {
                index_1.logger.debug("PaymentConfirmationController::get: Session data", {
                    booking: req.session.currentBooking,
                    candidate: req.session.candidate,
                });
                throw new Error("PaymentConfirmationController::get: Missing required session data");
            }
            const { bookingRef, dateTime, testType, centre } = req.session.currentBooking;
            const { email } = req.session.candidate;
            const { target = enums_1.Target.GB, locale = enums_1.Locale.GB } = req.session;
            const source = String(req === null || req === void 0 ? void 0 : req.baseUrl);
            const startAgainLink = index_1.getStartAgainLink(target, locale, source);
            let paymentId;
            const isTestTypeZeroCost = eligibility_1.isZeroCostTest(req.session.currentBooking.testType);
            const isCompensationBooking = req.session.currentBooking.compensationBooking;
            if (!isTestTypeZeroCost &&
                !isCompensationBooking &&
                !req.session.currentBooking.receiptReference) {
                throw new Error("PaymentConfirmationController::get: Missing required session data - receipt reference");
            }
            if (isCompensationBooking) {
                await this.compensateBooking(req.session.currentBooking, req.session.candidate);
            }
            else if (isTestTypeZeroCost) {
                index_1.logger.debug("PaymentConfirmationController::get: Updating CRM entity of zero cost booking", {
                    candidate: req.session.candidate,
                    ...index_1.getCreatedBookingIdentifiers(req),
                });
                await this.crmGateway.updateZeroCostBooking(req.session.currentBooking.bookingId);
            }
            else {
                try {
                    paymentId = await this.confirmPayment(req, res, req.session.currentBooking, req.session.candidate);
                }
                catch (error) {
                    session_1.store.reset(req, res);
                    if (error instanceof PaymentUnsuccessfulError_1.PaymentUnsuccessfulError) {
                        return res.render("common/payment-unsuccessful", {
                            startAgainLink,
                        });
                    }
                    if (error instanceof PaymentConfirmationError_1.PaymentConfirmationError) {
                        return res.render("common/payment-confirmation-error", {
                            startAgainLink,
                        });
                    }
                    if (error instanceof PaymentUserCancelledError_1.PaymentUserCancelledError) {
                        return res.render("common/booking-cancelled", {
                            startAgainLink,
                        });
                    }
                    if (error instanceof PaymentSystemError_1.PaymentSystemError) {
                        return res.render("common/payment-system-error", {
                            startAgainLink,
                            bookingRef,
                        });
                    }
                    throw error;
                }
            }
            const bookingCompletionResult = await this.completeBooking(req.session.currentBooking, req.session.candidate, paymentId, req);
            if (bookingCompletionResult.isConfirmed) {
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    lastRefundDate: bookingCompletionResult.lastRefundDate,
                };
            }
            else {
                session_1.store.reset(req, res); // Reset the session to prevent confirming the booking in the tcn after it becomes unreserved
                return res.render("create/slot-confirmation-error", {
                    bookingReference: bookingCompletionResult.bookingRef,
                    startAgainLink,
                });
            }
            try {
                const details = {
                    bookingRef,
                    testType,
                    testCentre: centre,
                    testDateTime: dateTime,
                    lastRefundDate: bookingCompletionResult.lastRefundDate,
                };
                const emailContent = builders_1.buildBookingConfirmationEmailContent(details, target, locale);
                await this.notifications.sendEmail(email, emailContent, bookingRef, target);
            }
            catch (error) {
                // Log and swallow - email failure not critical and should be followed up
                index_1.logger.error(error, "PaymentConfirmationController::get: Error sending booking confirmation email", { ...index_1.getCreatedBookingIdentifiers(req) });
            }
            try {
                const nsaBookings = await this.crmGateway.getUserDraftNSABookingsIfExist((_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.candidateId, (_b = req.session.currentBooking) === null || _b === void 0 ? void 0 : _b.testType);
                if (nsaBookings) {
                    await this.crmGateway.updateNSABookings(nsaBookings);
                }
            }
            catch (error) {
                index_1.logger.error(error, "PaymentConfirmationController::get: Error executing batch request to update nsa booking status", { ...index_1.getCreatedBookingIdentifiers(req) });
            }
            return res.redirect("/booking-confirmation");
        };
        this.compensateBooking = async (currentBooking, candidate) => {
            var _a, _b;
            if (!currentBooking.bookingProductId) {
                throw Error("PaymentConfirmationController::compensateBooking: Unable to create compensated booking - new booking product id does not exist");
            }
            try {
                await this.payments.compensateBooking({
                    compensatedBookingProductId: (_a = currentBooking.compensationBooking) === null || _a === void 0 ? void 0 : _a.bookingProductId,
                    newBookingProductId: currentBooking.bookingProductId,
                }, candidate === null || candidate === void 0 ? void 0 : candidate.candidateId, candidate === null || candidate === void 0 ? void 0 : candidate.personReference);
            }
            catch (error) {
                index_1.logger.error(error, "PaymentConfirmationController::compensateBooking: Failed to compensate booking", {
                    newBookingProductId: currentBooking.bookingProductId,
                    originalBookingProductId: (_b = currentBooking.compensationBooking) === null || _b === void 0 ? void 0 : _b.bookingProductId,
                    candidateId: candidate.candidateId,
                });
                throw error;
            }
        };
        this.confirmPayment = async (req, res, currentBooking, candidate) => {
            var _a, _b, _c, _d;
            const { bookingProductRef, centre, bookingProductId, bookingId, reservationId, } = currentBooking;
            if (!currentBooking.receiptReference) {
                throw new Error("PaymentConfirmationController::confirmPayment: Missing receipt reference");
            }
            if (!candidate.personReference) {
                throw new Error("PaymentConfirmationController::confirmPayment: Missing person reference");
            }
            let cardPaymentCompletionResponse;
            try {
                cardPaymentCompletionResponse =
                    await this.payments.confirmCardPaymentIsComplete(currentBooking.receiptReference, candidate.candidateId, candidate.personReference);
                index_1.logger.debug("PaymentConfirmationController::confirmPayment: confirmCardPayment response for booking", {
                    response: cardPaymentCompletionResponse,
                    ...index_1.getCreatedBookingIdentifiers(req),
                });
                if (cardPaymentCompletionResponse.code !== enums_3.PaymentStatus.SUCCESS) {
                    index_1.logger.warn("PaymentConfirmationController::confirmPayment: Payment status NOT successful - cancelling booking", {
                        cpmsCode: cardPaymentCompletionResponse.code,
                        cpmsMessage: cardPaymentCompletionResponse.message,
                        ...index_1.getCreatedBookingIdentifiers(req),
                    });
                    index_1.logger.event(index_1.BusinessTelemetryEvents.PAYMENT_FAILED, "PaymentConfirmationController::confirmPayment: Error confirming payment", {
                        ...index_1.getCreatedBookingIdentifiers(req),
                        cpmsCode: cardPaymentCompletionResponse === null || cardPaymentCompletionResponse === void 0 ? void 0 : cardPaymentCompletionResponse.code,
                    });
                    await this.bookingService.unreserveBooking(bookingProductRef, centre === null || centre === void 0 ? void 0 : centre.region, bookingProductId, bookingId, reservationId, enums_2.CRMBookingStatus.Draft);
                    throw new PaymentUnsuccessfulError_1.PaymentUnsuccessfulError();
                }
                return cardPaymentCompletionResponse.paymentId;
            }
            catch (error) {
                if (error instanceof PaymentUnsuccessfulError_1.PaymentUnsuccessfulError) {
                    throw error;
                }
                const errorCode = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.code; // TODO Tech debt: can we find a better way to type this?
                index_1.logger.error(error, "PaymentConfirmationController::confirmPayment: Error confirming payment for booking", {
                    response: (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data,
                    cpmsCode: errorCode,
                    ...index_1.getCreatedBookingIdentifiers(req),
                });
                index_1.logger.event(index_1.BusinessTelemetryEvents.PAYMENT_FAILED, "PaymentConfirmationController::confirmPayment: Error confirming payment", {
                    error,
                    cpmsCode: errorCode,
                    ...index_1.getCreatedBookingIdentifiers(req),
                });
                if (errorCode > 800) {
                    // Is a payment status
                    if (errorCode === enums_3.PaymentStatus.USER_CANCELLED) {
                        index_1.logger.event(index_1.BusinessTelemetryEvents.PAYMENT_CANCEL, "PaymentConfirmationController::confirmPayment: User cancelled payment", {
                            error,
                            cpmsCode: errorCode,
                            ...index_1.getCreatedBookingIdentifiers(req),
                        });
                        await this.bookingService.unreserveBooking(bookingProductRef, centre === null || centre === void 0 ? void 0 : centre.region, bookingProductId, bookingId, reservationId, enums_2.CRMBookingStatus.AbandonedNonRecoverable, (_d = req.session.currentBooking) === null || _d === void 0 ? void 0 : _d.paymentId);
                        throw new PaymentUserCancelledError_1.PaymentUserCancelledError();
                    }
                    else if (errorCode === enums_3.PaymentStatus.GATEWAY_ERROR) {
                        index_1.logger.event(index_1.BusinessTelemetryEvents.PAYMENT_GATEWAY_ERROR, "PaymentConfirmationController::confirmPayment: Payment API gateway error", {
                            error,
                            cpmsCode: errorCode,
                            ...index_1.getCreatedBookingIdentifiers(req),
                        });
                        await this.bookingService.unreserveBooking(bookingProductRef, centre === null || centre === void 0 ? void 0 : centre.region, bookingProductId, bookingId, reservationId, enums_2.CRMBookingStatus.SystemErrorNonRecoverable);
                    }
                    else if (errorCode === enums_3.PaymentStatus.SYSTEM_ERROR) {
                        index_1.logger.event(index_1.BusinessTelemetryEvents.PAYMENT_SYSTEM_ERROR, "PaymentConfirmationController::confirmPayment: Payment API system error", {
                            error,
                            cpmsCode: errorCode,
                            ...index_1.getCreatedBookingIdentifiers(req),
                        });
                        await this.bookingService.unreserveBooking(bookingProductRef, centre === null || centre === void 0 ? void 0 : centre.region, bookingProductId, bookingId, reservationId, enums_2.CRMBookingStatus.SystemErrorNonRecoverable);
                        throw new PaymentSystemError_1.PaymentSystemError();
                    }
                    else {
                        await this.bookingService.unreserveBooking(bookingProductRef, centre === null || centre === void 0 ? void 0 : centre.region, bookingProductId, bookingId, reservationId, enums_2.CRMBookingStatus.Draft);
                    }
                    throw new PaymentUnsuccessfulError_1.PaymentUnsuccessfulError();
                }
                else {
                    await this.bookingService.unreserveBooking(bookingProductRef, centre === null || centre === void 0 ? void 0 : centre.region, bookingProductId, bookingId, reservationId, enums_2.CRMBookingStatus.Draft);
                }
                // Other unknown error
                throw new PaymentConfirmationError_1.PaymentConfirmationError();
            }
        };
        this.completeBooking = async (booking, candidate, paymentId, req) => {
            const { bookingRef } = booking;
            let bookingCompletionResult = {
                isConfirmed: false,
                bookingRef,
            };
            try {
                bookingCompletionResult = await this.bookingService.completeBooking(candidate, booking, paymentId);
            }
            catch (error) {
                index_1.logger.error(error, "payment-confirmation::get: Error completing booking", {
                    bookingRef,
                    ...index_1.getCreatedBookingIdentifiers(req),
                });
                // If the error is CRM related, we would like to throw generic service unavailable error.
                if (error instanceof crm_1.CrmServerError) {
                    throw error;
                }
            }
            return bookingCompletionResult;
        };
    }
}
exports.PaymentConfirmationController = PaymentConfirmationController;
exports.default = new PaymentConfirmationController(notifications_gateway_1.notificationsGateway, booking_service_1.BookingService.getInstance(), payment_gateway_1.paymentGateway, crm_gateway_1.CRMGateway.getInstance());
