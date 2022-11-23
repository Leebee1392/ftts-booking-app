"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSupportRequestDetails = exports.buildRefundRequestEmailContent = exports.buildReturningCandidateEmailContent = exports.buildEvidenceMayBeRequiredEmailContent = exports.buildEvidenceNotRequiredEmailContent = exports.buildEvidenceRequiredEmailContent = exports.buildBookingRescheduledEmailContent = exports.buildBookingCancellationEmailContent = exports.buildBookingConfirmationEmailContent = void 0;
// Not passing user input so safe to ignore
/* eslint-disable security/detect-object-injection */
const _1 = __importDefault(require("."));
const enums_1 = require("../../../domain/enums");
const types_1 = require("../types");
// Want to default to NI content if target is NI
// TODO Can remove this when target+lang are eventually linked
const toLocale = (target, lang) => target === enums_1.Target.NI ? enums_1.Locale.NI : lang;
const buildBookingConfirmationEmailContent = (details, target, lang) => {
    const locale = toLocale(target, lang);
    const { subject, buildBody } = _1.default.email[types_1.EmailType.BOOKING_CONFIRMATION][locale];
    return {
        subject,
        body: buildBody(details),
    };
};
exports.buildBookingConfirmationEmailContent = buildBookingConfirmationEmailContent;
const buildBookingCancellationEmailContent = (details, target, lang) => {
    const locale = toLocale(target, lang);
    const { subject, buildBody } = _1.default.email[types_1.EmailType.BOOKING_CANCELLATION][locale];
    return {
        subject,
        body: buildBody(details),
    };
};
exports.buildBookingCancellationEmailContent = buildBookingCancellationEmailContent;
const buildBookingRescheduledEmailContent = (details, target, lang) => {
    const locale = toLocale(target, lang);
    const { subject, buildBody } = _1.default.email[types_1.EmailType.BOOKING_RESCHEDULED][locale];
    return {
        subject,
        body: buildBody(details),
    };
};
exports.buildBookingRescheduledEmailContent = buildBookingRescheduledEmailContent;
const buildEvidenceRequiredEmailContent = (details, target, lang) => {
    const locale = toLocale(target, lang);
    const { subject, buildBody } = _1.default.email[types_1.EmailType.EVIDENCE_REQUIRED][locale];
    return {
        subject,
        body: buildBody(details),
    };
};
exports.buildEvidenceRequiredEmailContent = buildEvidenceRequiredEmailContent;
const buildEvidenceNotRequiredEmailContent = (details, target, lang) => {
    const locale = toLocale(target, lang);
    const { subject, buildBody } = _1.default.email[types_1.EmailType.EVIDENCE_NOT_REQUIRED][locale];
    return {
        subject,
        body: buildBody(details),
    };
};
exports.buildEvidenceNotRequiredEmailContent = buildEvidenceNotRequiredEmailContent;
const buildEvidenceMayBeRequiredEmailContent = (details, target, lang) => {
    const locale = toLocale(target, lang);
    const { subject, buildBody } = _1.default.email[types_1.EmailType.EVIDENCE_MAY_BE_REQUIRED][locale];
    return {
        subject,
        body: buildBody(details),
    };
};
exports.buildEvidenceMayBeRequiredEmailContent = buildEvidenceMayBeRequiredEmailContent;
const buildReturningCandidateEmailContent = (details, target, lang) => {
    const locale = toLocale(target, lang);
    const { subject, buildBody } = _1.default.email[types_1.EmailType.RETURNING_CANDIDATE][locale];
    return {
        subject,
        body: buildBody(details),
    };
};
exports.buildReturningCandidateEmailContent = buildReturningCandidateEmailContent;
const buildRefundRequestEmailContent = (details, target, lang) => {
    const locale = toLocale(target, lang);
    const { subject, buildBody } = _1.default.email[types_1.EmailType.REFUND_REQUEST][locale];
    return {
        subject,
        body: buildBody(details),
    };
};
exports.buildRefundRequestEmailContent = buildRefundRequestEmailContent;
const buildSupportRequestDetails = (booking, target) => {
    var _a, _b;
    return ({
        reference: booking.bookingRef,
        testType: booking.testType,
        testLanguage: booking.language,
        supportTypes: (booking === null || booking === void 0 ? void 0 : booking.selectSupportType) || [],
        voiceover: ((_a = booking === null || booking === void 0 ? void 0 : booking.selectSupportType) === null || _a === void 0 ? void 0 : _a.includes(enums_1.SupportType.VOICEOVER))
            ? booking === null || booking === void 0 ? void 0 : booking.voiceover
            : undefined,
        translator: target === enums_1.Target.NI ? booking === null || booking === void 0 ? void 0 : booking.translator : undefined,
        customSupport: ((_b = booking === null || booking === void 0 ? void 0 : booking.selectSupportType) === null || _b === void 0 ? void 0 : _b.includes(enums_1.SupportType.OTHER))
            ? booking === null || booking === void 0 ? void 0 : booking.customSupport
            : undefined,
        preferredDay: {
            option: booking === null || booking === void 0 ? void 0 : booking.preferredDayOption,
            text: (booking === null || booking === void 0 ? void 0 : booking.preferredDayOption) === enums_1.PreferredDay.ParticularDay
                ? booking.preferredDay
                : undefined,
        },
        preferredLocation: {
            option: booking === null || booking === void 0 ? void 0 : booking.preferredLocationOption,
            text: (booking === null || booking === void 0 ? void 0 : booking.preferredLocationOption) === enums_1.PreferredLocation.ParticularLocation
                ? booking.preferredLocation
                : undefined,
        },
    });
};
exports.buildSupportRequestDetails = buildSupportRequestDetails;
