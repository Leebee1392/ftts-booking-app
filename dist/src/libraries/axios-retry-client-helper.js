"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRetryDelay = exports.parseRetryAfter = exports.isSystemError = exports.isGatewayError = exports.isUserCancelledError = exports.is429Error = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const logger_1 = require("../helpers/logger");
const enums_1 = require("../services/payments/enums");
function is429Error(err) {
    var _a;
    return ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 429;
}
exports.is429Error = is429Error;
function isUserCancelledError(err) {
    var _a, _b;
    return (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 500 &&
        ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data.code) === enums_1.PaymentStatus.USER_CANCELLED);
}
exports.isUserCancelledError = isUserCancelledError;
function isGatewayError(err) {
    var _a, _b;
    return (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 500 &&
        ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data.code) === enums_1.PaymentStatus.GATEWAY_ERROR);
}
exports.isGatewayError = isGatewayError;
function isSystemError(err) {
    var _a, _b;
    return (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 500 &&
        ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data.code) === enums_1.PaymentStatus.SYSTEM_ERROR);
}
exports.isSystemError = isSystemError;
function parseRetryAfter(header) {
    // Header value may be a string containing number of *seconds*
    const parsed = parseFloat(header);
    if (!Number.isNaN(parsed) && parsed >= 0) {
        return parsed * 1000;
    }
    // Or a date in http datetime string format
    const date = dayjs_1.default(header);
    if (date.isValid()) {
        const now = dayjs_1.default();
        const diff = date.diff(now, "ms");
        if (diff >= 0) {
            return diff;
        }
    }
    return undefined; // Otherwise invalid
}
exports.parseRetryAfter = parseRetryAfter;
function calculateRetryDelay(retryCount, err, retryPolicy) {
    var _a, _b, _c, _d, _e, _f, _g;
    let delay = retryPolicy.exponentialBackoff
        ? retryPolicy.defaultRetryDelay * retryCount
        : retryPolicy.defaultRetryDelay;
    if (is429Error(err)) {
        const retryAfterHeader = (_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b["retry-after"];
        if (retryAfterHeader) {
            delay =
                (_c = parseRetryAfter(retryAfterHeader)) !== null && _c !== void 0 ? _c : retryPolicy.defaultRetryDelay;
            if (delay > retryPolicy.maxRetryAfter) {
                throw err;
            }
        }
    }
    logger_1.logger.warn(`axiosRetryClientHelper::calculateRetryDelay:Retrying failed ${(_d = err.config) === null || _d === void 0 ? void 0 : _d.method} request to ${(_e = err.config) === null || _e === void 0 ? void 0 : _e.url} - attempt ${retryCount} of ${retryPolicy.maxRetries}`, {
        error: err.toString(),
        status: (_f = err.response) === null || _f === void 0 ? void 0 : _f.status,
        url: (_g = err.config) === null || _g === void 0 ? void 0 : _g.url,
        retryDelayMs: delay,
    });
    return delay;
}
exports.calculateRetryDelay = calculateRetryDelay;
