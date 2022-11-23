"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentInitiationController = void 0;
const ftts_payment_api_model_1 = require("@dvsa/ftts-payment-api-model");
const config_1 = __importDefault(require("../../config"));
const logger_1 = require("../../helpers/logger");
const enums_1 = require("../../domain/enums");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const crm_address_mapper_1 = require("../../services/crm-gateway/crm-address-mapper");
const payment_gateway_1 = require("../../services/payments/payment-gateway");
const log_helper_1 = require("../../helpers/log-helper");
class PaymentInitiationController {
    constructor(crmGateway, payments) {
        this.crmGateway = crmGateway;
        this.payments = payments;
        this.get = async (req, res) => {
            var _a, _b;
            const { candidate } = req.session;
            const { currentBooking: booking } = req.session;
            if (!(candidate === null || candidate === void 0 ? void 0 : candidate.address) ||
                !(candidate === null || candidate === void 0 ? void 0 : candidate.firstnames) ||
                !(candidate === null || candidate === void 0 ? void 0 : candidate.surname) ||
                !(candidate === null || candidate === void 0 ? void 0 : candidate.candidateId) ||
                !(candidate === null || candidate === void 0 ? void 0 : candidate.personReference) ||
                !(booking === null || booking === void 0 ? void 0 : booking.bookingProductId) ||
                !(booking === null || booking === void 0 ? void 0 : booking.salesReference) ||
                !(booking === null || booking === void 0 ? void 0 : booking.priceList)) {
                logger_1.logger.warn("PaymentInitiationController::get: Missing required session data", {
                    candidateAddress: !(candidate === null || candidate === void 0 ? void 0 : candidate.address),
                    candidateFirstname: !(candidate === null || candidate === void 0 ? void 0 : candidate.firstnames),
                    candidateSurname: !(candidate === null || candidate === void 0 ? void 0 : candidate.surname),
                    candidateID: !(candidate === null || candidate === void 0 ? void 0 : candidate.candidateId),
                    candidateReference: !(candidate === null || candidate === void 0 ? void 0 : candidate.personReference),
                    bookingProduct: !(booking === null || booking === void 0 ? void 0 : booking.bookingProductId),
                    bookingSalesRef: !(booking === null || booking === void 0 ? void 0 : booking.salesReference),
                    bookingPriceList: !(booking === null || booking === void 0 ? void 0 : booking.priceList),
                });
                throw new Error("PaymentInitiationController::get: Missing required session data");
            }
            const candidateAddressCrmFormat = crm_address_mapper_1.mapToCrmContactAddress(candidate.address);
            const customerAddress = {
                line1: candidateAddressCrmFormat.address1_line1,
                line2: candidateAddressCrmFormat === null || candidateAddressCrmFormat === void 0 ? void 0 : candidateAddressCrmFormat.address1_line2,
                line3: candidateAddressCrmFormat === null || candidateAddressCrmFormat === void 0 ? void 0 : candidateAddressCrmFormat.address1_line3,
                line4: candidateAddressCrmFormat === null || candidateAddressCrmFormat === void 0 ? void 0 : candidateAddressCrmFormat.ftts_address1_line4,
                city: candidateAddressCrmFormat.address1_city,
                postcode: candidateAddressCrmFormat.address1_postalcode,
            };
            const paymentAmount = booking.priceList.price.toFixed(2);
            const redirectUriBase = ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.isInstructor)
                ? `${config_1.default.payment.redirectUri}/instructor`
                : config_1.default.payment.redirectUri;
            const redirectUri = `${redirectUriBase}/payment-confirmation-loading/${booking.bookingRef}`;
            const cardPaymentPayload = {
                countryCode: req.session.target === enums_1.Target.NI
                    ? ftts_payment_api_model_1.Candidate.CardPaymentPayload.CountryCodeEnum.NI
                    : ftts_payment_api_model_1.Candidate.CardPaymentPayload.CountryCodeEnum.GB,
                customerAddress,
                customerManagerName: `${candidate.firstnames} ${candidate.surname}`,
                customerName: `${candidate.firstnames} ${candidate.surname}`,
                customerReference: candidate.candidateId,
                paymentData: [
                    {
                        lineIdentifier: 1,
                        amount: paymentAmount,
                        allocatedAmount: paymentAmount,
                        netAmount: paymentAmount,
                        taxAmount: "0.00",
                        taxCode: "AX",
                        taxRate: 0,
                        productReference: booking.bookingProductId,
                        productDescription: booking.priceList.product.productId,
                        receiverReference: candidate.candidateId,
                        receiverName: `${candidate.firstnames} ${candidate.surname}`,
                        receiverAddress: customerAddress,
                        salesReference: booking.salesReference,
                        salesPersonReference: null,
                    },
                ],
                hasInvoice: true,
                refundOverpayment: false,
                redirectUri,
                scope: ftts_payment_api_model_1.Candidate.CardPaymentPayload.ScopeEnum.CARD,
                totalAmount: paymentAmount,
            };
            logger_1.logger.debug("PaymentInitiationController::get: cardPaymentPayload", {
                cardPaymentPayload,
                ...log_helper_1.getCreatedBookingIdentifiers(req),
            });
            let cardPaymentResponse;
            try {
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_REDIRECT, "PaymentInitiationController::get: Sending user to payment processor", {
                    personReference: candidate === null || candidate === void 0 ? void 0 : candidate.personReference,
                    instructorPersonalReferenceNumber: candidate === null || candidate === void 0 ? void 0 : candidate.personalReferenceNumber,
                    ...log_helper_1.getCreatedBookingIdentifiers(req),
                });
                cardPaymentResponse = await this.payments.initiateCardPayment(cardPaymentPayload, candidate.candidateId, candidate.personReference);
            }
            catch (error) {
                logger_1.logger.error(error, "PaymentInitiationController::get: Payment service error", {
                    response: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    personReference: candidate === null || candidate === void 0 ? void 0 : candidate.personReference,
                    instructorPersonalReferenceNumber: candidate === null || candidate === void 0 ? void 0 : candidate.personalReferenceNumber,
                    ...log_helper_1.getCreatedBookingIdentifiers(req),
                });
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_FAILED, "PaymentInitiationController::get: Payment service error", {
                    error,
                    personReference: candidate === null || candidate === void 0 ? void 0 : candidate.personReference,
                    instructorPersonalReferenceNumber: candidate === null || candidate === void 0 ? void 0 : candidate.personalReferenceNumber,
                    ...log_helper_1.getCreatedBookingIdentifiers(req),
                });
                if (error.status === 500) {
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_ERROR, "PaymentInitiationController::get: Payment service internal server error", {
                        error,
                        personReference: candidate === null || candidate === void 0 ? void 0 : candidate.personReference,
                        instructorPersonalReferenceNumber: candidate === null || candidate === void 0 ? void 0 : candidate.personalReferenceNumber,
                        ...log_helper_1.getCreatedBookingIdentifiers(req),
                    });
                }
                if (error.status === 401 || error.status === 403) {
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_AUTH_ISSUE, "PaymentInitiationController::get: Payment authorisation error", {
                        error,
                        personReference: candidate === null || candidate === void 0 ? void 0 : candidate.personReference,
                        instructorPersonalReferenceNumber: candidate === null || candidate === void 0 ? void 0 : candidate.personalReferenceNumber,
                        ...log_helper_1.getCreatedBookingIdentifiers(req),
                    });
                }
                return res.render("create/payment-initiation-error");
            }
            try {
                await this.crmGateway.createBindBetweenBookingAndPayment(booking.bookingId, cardPaymentResponse.paymentId, cardPaymentResponse.receiptReference);
            }
            catch (error) {
                logger_1.logger.warn("PaymentInitiationController::get: No bind was created between the booking entity and the payment entity", {
                    receiptReference: cardPaymentResponse.receiptReference,
                    reason: error.message,
                    ...log_helper_1.getCreatedBookingIdentifiers(req),
                });
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                receiptReference: cardPaymentResponse.receiptReference,
                paymentId: cardPaymentResponse.paymentId,
            };
            logger_1.logger.info("PaymentInitiationController::get: Receipt reference and Payment ID added to session", {
                receiptReference: cardPaymentResponse.receiptReference,
                paymentId: cardPaymentResponse.paymentId,
                ...log_helper_1.getCreatedBookingIdentifiers(req),
            });
            return res.redirect(cardPaymentResponse.gatewayUrl);
        };
    }
}
exports.PaymentInitiationController = PaymentInitiationController;
exports.default = new PaymentInitiationController(crm_gateway_1.CRMGateway.getInstance(), payment_gateway_1.paymentGateway);
