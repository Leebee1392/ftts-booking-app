"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaymentRefundPayload = exports.buildPaymentReference = void 0;
const ftts_payment_api_model_1 = require("@dvsa/ftts-payment-api-model");
const dayjs_1 = __importDefault(require("dayjs"));
const uuid_1 = require("uuid");
const enums_1 = require("../../domain/enums");
const crm_address_mapper_1 = require("../crm-gateway/crm-address-mapper");
const buildPaymentReference = (limit) => {
    const uuid = uuid_1.v4();
    const uuidNoDashes = uuid.replace(/-/g, "");
    return `FTT${uuidNoDashes.substring(limit, 32)}${dayjs_1.default().format("YYMMDDHHMMss")}`.toUpperCase();
};
exports.buildPaymentReference = buildPaymentReference;
const buildPaymentRefundPayload = (candidate, booking, target) => {
    const refundAmount = booking.details.price.toFixed(2);
    const candidateAddressCrmFormat = crm_address_mapper_1.mapToCrmContactAddress(candidate.address);
    const payload = {
        scope: ftts_payment_api_model_1.Candidate.BatchRefundPayload.ScopeEnum.REFUND,
        customerReference: candidate.candidateId,
        customerName: `${candidate.firstnames} ${candidate.surname}`,
        customerManagerName: `${candidate.firstnames} ${candidate.surname}`,
        customerAddress: {
            line1: candidateAddressCrmFormat.address1_line1,
            line2: candidateAddressCrmFormat.address1_line2,
            line3: candidateAddressCrmFormat.address1_line3,
            line4: candidateAddressCrmFormat.ftts_address1_line4,
            city: candidateAddressCrmFormat.address1_city,
            postcode: candidateAddressCrmFormat.address1_postalcode,
        },
        countryCode: target === enums_1.Target.NI
            ? ftts_payment_api_model_1.Candidate.BatchRefundPayload.CountryCodeEnum.NI
            : ftts_payment_api_model_1.Candidate.BatchRefundPayload.CountryCodeEnum.GB,
        payments: [
            {
                refundReason: "Test cancelled by candidate",
                bookingProductId: booking.details.bookingProductId,
                totalAmount: refundAmount,
                paymentData: [
                    {
                        lineIdentifier: 1,
                        amount: refundAmount,
                        netAmount: refundAmount,
                        taxAmount: "0.00",
                        salesReference: booking.details.salesReference,
                    },
                ],
            },
        ],
    };
    return payload;
};
exports.buildPaymentRefundPayload = buildPaymentRefundPayload;
