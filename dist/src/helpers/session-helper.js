"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeoutErrorPath = exports.isCandidateSet = exports.getSessionExpiryInfo = exports.mapSessionCentreToCentreEntity = exports.mapCentreEntityToSessionCentre = exports.mapBookingEntityToSessionBooking = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const config_1 = __importDefault(require("../config"));
const enums_1 = require("../domain/enums");
const test_language_1 = require("../domain/test-language");
const test_voiceover_1 = require("../domain/test-voiceover");
const enums_2 = require("../services/crm-gateway/enums");
const maps_1 = require("../services/crm-gateway/maps");
const links_1 = require("./links");
function mapBookingEntityToSessionBooking(bookingEntity) {
    var _a;
    return {
        bookingId: bookingEntity.details.bookingId,
        bookingProductId: bookingEntity.details.bookingProductId,
        bookingRef: bookingEntity.details.reference,
        bookingProductRef: bookingEntity.details.bookingProductRef,
        bsl: bookingEntity.details.additionalSupport ===
            enums_2.CRMAdditionalSupport.BritishSignLanguage,
        centre: mapCentreEntityToSessionCentre(bookingEntity.details.testCentre),
        dateTime: bookingEntity.details.testDate,
        language: test_language_1.TestLanguage.fromCRMTestLanguage(bookingEntity.details.testLanguage).key(),
        salesReference: bookingEntity.details.salesReference,
        receiptReference: "",
        voiceover: test_voiceover_1.TestVoiceover.fromCRMVoiceover(bookingEntity.details.voiceoverLanguage),
        lastRefundDate: bookingEntity.details
            .testDateMinus3ClearWorkingDays,
        reservationId: "",
        translator: undefined,
        customSupport: bookingEntity.details.customSupport,
        selectSupportType: [],
        voicemail: false,
        preferredDay: bookingEntity.details.preferredDay || "",
        preferredDayOption: bookingEntity.details.preferredDayOption,
        preferredLocation: bookingEntity.details.preferredLocation || "",
        preferredLocationOption: bookingEntity.details.preferredLocationOption,
        governmentAgency: bookingEntity.details.governmentAgency === enums_2.CRMGovernmentAgency.Dva
            ? enums_1.Target.NI
            : enums_1.Target.GB,
        testType: maps_1.fromCRMProductNumber((_a = bookingEntity.details.product) === null || _a === void 0 ? void 0 : _a.productnumber),
        origin: maps_1.fromCRMOrigin(bookingEntity.details.origin),
    };
}
exports.mapBookingEntityToSessionBooking = mapBookingEntityToSessionBooking;
function mapCentreEntityToSessionCentre(centreEntity) {
    return {
        testCentreId: centreEntity.testCentreId,
        name: centreEntity.name,
        addressLine1: centreEntity.addressLine1,
        addressLine2: centreEntity.addressLine2,
        addressCity: centreEntity.addressCity,
        addressCounty: centreEntity.addressCounty,
        addressPostalCode: centreEntity.addressPostalCode,
        remit: centreEntity.remit,
        region: centreEntity.region,
        siteId: centreEntity.siteId,
    };
}
exports.mapCentreEntityToSessionCentre = mapCentreEntityToSessionCentre;
function mapSessionCentreToCentreEntity(centre) {
    return {
        testCentreId: centre.testCentreId,
        name: centre.name,
        addressLine1: centre.addressLine1,
        addressLine2: centre.addressLine2,
        addressCounty: centre.addressCounty,
        addressCity: centre.addressCity,
        addressPostalCode: centre.addressPostalCode,
        remit: centre.remit,
        region: centre.region,
        siteId: centre.siteId,
    };
}
exports.mapSessionCentreToCentreEntity = mapSessionCentreToCentreEntity;
function getSessionExpiryInfo(req) {
    var _a, _b;
    if ((_b = (_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.cookie) === null || _b === void 0 ? void 0 : _b.expires) {
        const now = dayjs_1.default().tz();
        const expiryDateDayjs = now.add(config_1.default.sessionTtlSessionDuration, "seconds");
        const expiryDateNotificationDayjs = expiryDateDayjs.subtract(config_1.default.sessionTimeoutWarningMinutes, "minutes");
        const notificationDelay = expiryDateNotificationDayjs.diff(now, "seconds");
        const expiryDelay = expiryDateDayjs.diff(now, "seconds");
        return {
            notificationDelay,
            expiryDelay,
        };
    }
    return undefined;
}
exports.getSessionExpiryInfo = getSessionExpiryInfo;
const isCandidateSet = (req) => { var _a; return !!((_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.candidateId); };
exports.isCandidateSet = isCandidateSet;
function getTimeoutErrorPath(req) {
    return links_1.getErrorPageLink("/timeout", req);
}
exports.getTimeoutErrorPath = getTimeoutErrorPath;
