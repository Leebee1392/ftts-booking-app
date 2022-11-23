"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentGateway = exports.PaymentGateway = void 0;
const ftts_payment_api_model_1 = require("@dvsa/ftts-payment-api-model");
const config_1 = __importDefault(require("../../config"));
const logger_1 = require("../../helpers/logger");
const axios_retry_client_1 = require("../../libraries/axios-retry-client");
const axios_retry_client_for_payment_errors_1 = require("../../libraries/axios-retry-client-for-payment-errors");
const managed_identity_auth_1 = require("../auth/managed-identity-auth");
const enums_1 = require("./enums");
var UserPrefix;
(function (UserPrefix) {
    UserPrefix["Person"] = "person";
    UserPrefix["CrmUser"] = "crmuser";
})(UserPrefix || (UserPrefix = {}));
class PaymentGateway {
    constructor(auth = new managed_identity_auth_1.ManagedIdentityAuth(config_1.default.payment.identity), axiosRetryClient = new axios_retry_client_1.AxiosRetryClient(config_1.default.payment.retryPolicy).getClient(), userCancelledAxiosRetryClient = new axios_retry_client_for_payment_errors_1.AxiosRetryClientForPaymentErrors(config_1.default.payment.retryPolicy).getClient(), apiUrl = config_1.default.payment.baseUrl) {
        this.auth = auth;
        this.axiosRetryClient = axiosRetryClient;
        this.userCancelledAxiosRetryClient = userCancelledAxiosRetryClient;
        this.apiUrl = apiUrl;
    }
    async initiateCardPayment(cardPaymentPayload, userId, personReference) {
        logger_1.logger.debug("PaymentApiClient::initiateCardPayment: sending payload", {
            cardPaymentPayload,
        });
        logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_STARTED, "PaymentApiClient::initiateCardPayment: Start", {
            personReference,
            userId,
        });
        const requestUrl = `${this.apiUrl}/api/v1/candidate/payment/card`;
        const response = await this.axiosRetryClient.post(requestUrl, ftts_payment_api_model_1.Candidate.ObjectSerializer.serialize(cardPaymentPayload, "CardPaymentPayload"), await this.headers(`${UserPrefix.Person}:${userId}`, personReference));
        const responseData = ftts_payment_api_model_1.Candidate.ObjectSerializer.deserialize(response.data, "CardPaymentResponse");
        logger_1.logger.debug("PaymentApiClient::initiateCardPayment: received response", {
            responseData,
        });
        return responseData;
    }
    async confirmCardPaymentIsComplete(receiptReference, userId, personReference) {
        var _a;
        logger_1.logger.debug("PaymentApiClient::confirmCardPaymentIsComplete: sending payload", { receiptReference });
        const requestUrl = `${this.apiUrl}/api/v1/candidate/gateway/${receiptReference}/complete`;
        const response = await this.userCancelledAxiosRetryClient.put(requestUrl, null, await this.headers(`${UserPrefix.Person}:${userId}`, personReference));
        const responseData = ftts_payment_api_model_1.Candidate.ObjectSerializer.deserialize(response.data, "CardPaymentCompletionResponse");
        logger_1.logger.debug("PaymentApiClient::confirmCardPaymentIsComplete: received response", { responseData });
        if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.code) === enums_1.PaymentStatus.SUCCESS) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_SUCCESS, "PaymentApiClient::confirmCardPaymentIsComplete: Finished", {
                userId,
                personReference,
            });
        }
        return responseData;
    }
    async requestRefund(batchRefundPayload, userId, personReference) {
        logger_1.logger.debug("PaymentApiClient::requestRefund: sending payload", {
            batchRefundPayload,
        });
        logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_REFUND_INITIATED, "PaymentApiClient::requestRefund: Started", {
            userId,
            personReference,
        });
        const requestUrl = `${this.apiUrl}/api/v1/candidate/refund`;
        const response = await this.axiosRetryClient.post(requestUrl, ftts_payment_api_model_1.Candidate.ObjectSerializer.serialize(batchRefundPayload, "BatchRefundPayload"), await this.headers(`${UserPrefix.Person}:${userId}`, personReference));
        const responseData = ftts_payment_api_model_1.Candidate.ObjectSerializer.deserialize(response.data, "BatchPaymentRefundResponse");
        logger_1.logger.debug("PaymentApiClient::requestRefund: received response", {
            responseData,
        });
        if ((responseData === null || responseData === void 0 ? void 0 : responseData.code) &&
            Number(responseData === null || responseData === void 0 ? void 0 : responseData.code) === enums_1.PaymentStatus.REFUND_SUCCESS) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_REFUND_SUCCESS, "PaymentApiClient::requestRefund: Finished", {
                userId,
                personReference,
            });
        }
        return responseData;
    }
    async recogniseIncome(recogniseIncomePayload, userId, personReference) {
        logger_1.logger.debug("PaymentApiClient::recogniseIncome: sending payload", {
            recogniseIncomePayload,
        });
        const requestUrl = `${this.apiUrl}/api/v1/finance/recognitions`;
        try {
            const response = await this.axiosRetryClient.post(requestUrl, ftts_payment_api_model_1.Candidate.ObjectSerializer.serialize(recogniseIncomePayload, "RecogniseIncomePayload"), await this.headers(`${UserPrefix.Person}:${userId}`, personReference));
            logger_1.logger.debug("PaymentApiClient::recogniseIncome: call finished", {
                httpCode: response.status,
            });
            if (response.status >= 400) {
                throw new Error(`HTTP request error - ${response.status}: ${response.statusText}`);
            }
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_INCOME_SUCCESS, "PaymentApiClient::recogniseIncome: Finished", {
                userId,
                personReference,
            });
        }
        catch (error) {
            logger_1.logger.error(error, "PaymentApiClient::recogniseIncome: Failed to recognise income", {
                ...recogniseIncomePayload,
            });
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_INCOME_FAIL, "PaymentApiClient::recogniseIncome: Failed to recognise income", {
                ...recogniseIncomePayload,
            });
            throw error;
        }
    }
    async compensateBooking(compensatedBookingPayload, userId, personReference) {
        logger_1.logger.debug("PaymentApiClient::compensateBooking: sending payload", {
            compensatedBookingPayload,
        });
        const requestUrl = `${this.apiUrl}/api/v1/finance/compensation-booking`;
        try {
            const response = await this.axiosRetryClient.post(requestUrl, compensatedBookingPayload, await this.headers(`${UserPrefix.Person}:${userId}`, personReference));
            logger_1.logger.debug("PaymentApiClient::compensateBooking: call response", {
                httpCode: response.status,
            });
            if (response.status >= 400) {
                throw new Error(`HTTP request error - ${response.status}: ${response.statusText}`);
            }
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_COMPENSATION_SUCCESS, "PaymentApiClient::compensateBooking: Finished Successfully", {
                ...compensatedBookingPayload,
            });
        }
        catch (error) {
            logger_1.logger.error(error, "PaymentApiClient::compensateBooking: Failed to compensate booking", {
                ...compensatedBookingPayload,
            });
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_COMPENSATION_FAIL, "PaymentApiClient::compensateBooking: Failed to compensate booking", {
                ...compensatedBookingPayload,
            });
            throw error;
        }
    }
    async headers(paymentUserId, personReference) {
        try {
            const authHeaders = await this.auth.getAuthHeader();
            return {
                headers: {
                    ...authHeaders.headers,
                    "X-FTTS-PAYMENT-USER-ID": paymentUserId,
                    "X-FTTS-PAYMENT-PERSON-REFERENCE": personReference,
                },
            };
        }
        catch (error) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.PAYMENT_AUTH_ISSUE, "PaymentApiClient::headers: Failed to get token", {
                error,
                paymentUserId,
                personReference,
            });
            throw error;
        }
    }
}
exports.PaymentGateway = PaymentGateway;
const paymentGateway = new PaymentGateway();
exports.paymentGateway = paymentGateway;
__exportStar(require("@dvsa/ftts-payment-api-model"), exports);
