"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessTelemetryEvents = exports.logger = exports.Logger = void 0;
const azure_logger_1 = require("@dvsa/azure-logger");
const cls_hooked_1 = require("cls-hooked");
class Logger extends azure_logger_1.Logger {
    critical(message, properties) {
        super.critical(message, this.buildLogProps(properties));
    }
    error(error, message, properties) {
        super.error(error, message, this.buildLogProps(properties));
    }
    warn(message, properties) {
        super.warn(message, this.buildLogProps(properties));
    }
    event(name, message, properties) {
        super.event(name, message, this.buildLogProps(properties));
    }
    request(name, properties) {
        super.request(name, this.buildLogProps(properties));
    }
    dependency(name, data, properties) {
        super.dependency(name, data, this.buildLogProps(properties));
    }
    security(message, properties) {
        super.security(message, this.buildLogProps(properties));
    }
    audit(message, properties) {
        super.audit(message, this.buildLogProps(properties));
    }
    log(message, properties) {
        super.log(message, this.buildLogProps(properties));
    }
    info(message, properties) {
        super.info(message, this.buildLogProps(properties));
    }
    debug(message, properties) {
        super.debug(message, this.buildLogProps(properties));
    }
    buildLogProps(customProps) {
        var _a, _b, _c;
        return {
            sessionId: (_a = cls_hooked_1.getNamespace("app")) === null || _a === void 0 ? void 0 : _a.get("sessionId"),
            "X-Azure-Ref": (_b = cls_hooked_1.getNamespace("app")) === null || _b === void 0 ? void 0 : _b.get("X-Azure-Ref"),
            "INCAP-REQ-ID": (_c = cls_hooked_1.getNamespace("app")) === null || _c === void 0 ? void 0 : _c.get("INCAP-REQ-ID"),
            ...customProps,
        };
    }
}
exports.Logger = Logger;
const logger = new Logger("FTTS", process.env.WEBSITE_SITE_NAME || "ftts-booking-app");
exports.logger = logger;
var BusinessTelemetryEvents;
(function (BusinessTelemetryEvents) {
    BusinessTelemetryEvents["CDS_AUTH_ISSUE"] = "CP_CDS_AUTH_ISSUE";
    BusinessTelemetryEvents["CDS_ERROR"] = "CP_CDS_ERROR";
    BusinessTelemetryEvents["CDS_FAIL_BOOKING_CANCEL"] = "CP_CDS_FAIL_BOOKING_CANCEL";
    BusinessTelemetryEvents["CDS_FAIL_BOOKING_CHANGE_UPDATE"] = "CP_CDS_FAIL_BOOKING_CHANGE_UPDATE";
    BusinessTelemetryEvents["CDS_FAIL_BOOKING_NEW_UPDATE"] = "CP_CDS_FAIL_BOOKING_NEW_UPDATE";
    BusinessTelemetryEvents["CDS_REQUEST_ISSUE"] = "CP_CDS_REQUEST_ISSUE";
    BusinessTelemetryEvents["CDS_REQUEST_RESPONSE_MISMATCH"] = "CP_REQUEST_RESPONSE_MISMATCH";
    BusinessTelemetryEvents["ELIGIBILITY_AUTH_ISSUE"] = "CP_ELIGIBILITY_AUTH_ISSUE";
    BusinessTelemetryEvents["ELIGIBILITY_ERROR"] = "CP_ELIGIBILITY_ERROR";
    BusinessTelemetryEvents["ELIGIBILITY_REQUEST_ISSUE"] = "CP_ELIGIBILITY_REQUEST_ISSUE";
    BusinessTelemetryEvents["LOC_AUTH_ISSUE"] = "CP_LOC_AUTH_ISSUE";
    BusinessTelemetryEvents["LOC_ERROR"] = "CP_LOC_ERROR";
    BusinessTelemetryEvents["LOC_REQUEST_ISSUE"] = "CP_LOC_REQUEST_ISSUE";
    BusinessTelemetryEvents["NOT_WHITELISTED_URL_CALL"] = "NOT_WHITELISTED_URL_CALL";
    BusinessTelemetryEvents["NOTIF_AUTH_ISSUE"] = "CP_NOTIF_AUTH_ISSUE";
    BusinessTelemetryEvents["NOTIF_ERROR"] = "CP_NOTIF_ERROR";
    BusinessTelemetryEvents["NOTIF_REQUEST_ISSUE"] = "CP_NOTIF_REQUEST_ISSUE";
    BusinessTelemetryEvents["PAYMENT_AUTH_ISSUE"] = "CP_PAYMENT_AUTH_ISSUE";
    BusinessTelemetryEvents["PAYMENT_BACK"] = "CP_PAYMENT_BACK";
    BusinessTelemetryEvents["PAYMENT_CANCEL"] = "CP_PAYMENT_CANCEL";
    BusinessTelemetryEvents["PAYMENT_ERROR"] = "CP_PAYMENT_ERROR";
    BusinessTelemetryEvents["PAYMENT_FAILED"] = "CP_PAYMENT_FAILED";
    BusinessTelemetryEvents["PAYMENT_GATEWAY_ERROR"] = "CP_PAYMENT_GATEWAY_ERROR";
    BusinessTelemetryEvents["PAYMENT_SYSTEM_ERROR"] = "CP_PAYMENT_SYSTEM_ERROR";
    BusinessTelemetryEvents["PAYMENT_INCOME_SUCCESS"] = "CP_PAYMENT_INCOME_SUCCESS";
    BusinessTelemetryEvents["PAYMENT_INCOME_FAIL"] = "CP_PAYMENT_INCOME_FAIL";
    BusinessTelemetryEvents["PAYMENT_REDIRECT"] = "CP_PAYMENT_REDIRECT";
    BusinessTelemetryEvents["PAYMENT_REDIRECT_SESSION_FAIL"] = "CP_PAYMENT_REDIRECT_SESSION_FAIL";
    BusinessTelemetryEvents["PAYMENT_REFUND_FAIL"] = "CP_PAYMENT_REFUND_FAIL";
    BusinessTelemetryEvents["PAYMENT_REFUND_INITIATED"] = "CP_PAYMENT_REFUND_INITIATED";
    BusinessTelemetryEvents["PAYMENT_REFUND_SUCCESS"] = "CP_PAYMENT_REFUND_SUCCESS";
    BusinessTelemetryEvents["PAYMENT_REQUEST_ISSUE"] = "CP_PAYMENT_REQUEST_ISSUE";
    BusinessTelemetryEvents["PAYMENT_STARTED"] = "CP_PAYMENT_STARTED";
    BusinessTelemetryEvents["PAYMENT_SUCCESS"] = "CP_PAYMENT_SUCCESS";
    BusinessTelemetryEvents["PAYMENT_COMPENSATION_SUCCESS"] = "CP_PAYMENT_COMPENSATION_SUCCESS";
    BusinessTelemetryEvents["PAYMENT_COMPENSATION_FAIL"] = "CP_PAYMENT_COMPENSATION_FAIL";
    BusinessTelemetryEvents["SCHEDULING_AUTH_ISSUE"] = "CP_SCHEDULING_AUTH_ISSUE";
    BusinessTelemetryEvents["SCHEDULING_ERROR"] = "CP_SCHEDULING_ERROR";
    BusinessTelemetryEvents["SCHEDULING_FAIL_CONFIRM_CHANGE"] = "CP_SCHEDULING_FAIL_CONFIRM_CHANGE";
    BusinessTelemetryEvents["SCHEDULING_FAIL_CONFIRM_NEW"] = "CP_SCHEDULING_FAIL_CONFIRM_NEW";
    BusinessTelemetryEvents["SCHEDULING_FAIL_CONFIRM_CANCEL"] = "CP_SCHEDULING_FAIL_CONFIRM_CANCEL";
    BusinessTelemetryEvents["SCHEDULING_FAIL_DELETE"] = "CP_SCHEDULING_FAIL_DELETE";
    BusinessTelemetryEvents["SCHEDULING_REQUEST_ISSUE"] = "CP_SCHEDULING_REQUEST_ISSUE";
    BusinessTelemetryEvents["SCHEDULING_SLOT_EXP"] = "CP_SCHEDULING_SLOT_EXP";
    BusinessTelemetryEvents["SCHEDULING_RESERVATION_SUCCESS"] = "CP_SCHEDULING_RESERVATION_SUCCESS";
    BusinessTelemetryEvents["SCHEDULING_BOOKING_CONFIRMATION_SUCCESS"] = "CP_SCHEDULING_BOOKING_CONFRIMATION_SUCCESS";
    BusinessTelemetryEvents["SCHEDULING_SLOT_INVALID_ERROR"] = "CP_SCHEDULING_SLOT_INVALID_ERROR";
    BusinessTelemetryEvents["SESSION_TIMEOUT"] = "CP_SESSION_TIMEOUT";
})(BusinessTelemetryEvents || (BusinessTelemetryEvents = {}));
exports.BusinessTelemetryEvents = BusinessTelemetryEvents;
