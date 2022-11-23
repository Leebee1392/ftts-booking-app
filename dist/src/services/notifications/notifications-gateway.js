"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = exports.notificationsGateway = void 0;
const config_1 = __importDefault(require("../../config"));
const logger_1 = require("../../helpers/logger");
const managed_identity_auth_1 = require("../auth/managed-identity-auth");
const axios_retry_client_1 = require("../../libraries/axios-retry-client");
const EMAIL_ENDPOINT = "email";
class NotificationsGateway {
    constructor(auth, axiosRetryClient = new axios_retry_client_1.AxiosRetryClient(config_1.default.notification.retryPolicy).getClient(), apiUrl = config_1.default.notification.baseUrl, contextId = config_1.default.serviceContextId) {
        this.auth = auth;
        this.axiosRetryClient = axiosRetryClient;
        this.apiUrl = apiUrl;
        this.contextId = contextId;
    }
    async sendEmail(emailAddress, content, reference, target) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { subject, body } = content;
        const payload = {
            email_address: emailAddress,
            message_subject: subject,
            message_content: body,
            reference,
            target,
            context_id: this.contextId,
        };
        try {
            await this.sendRequest(EMAIL_ENDPOINT, payload);
        }
        catch (error) {
            const errorMessage = "NotificationsGateway::sendEmail: Notification API send email request failed";
            logger_1.logger.error(error, errorMessage);
            const errorPayload = {
                reference,
                error: error.toString(),
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                response: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
            };
            switch (true) {
                case ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 401:
                case ((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 403:
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.NOTIF_AUTH_ISSUE, errorMessage, errorPayload);
                    break;
                case ((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) >= 500 && ((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) < 600:
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.NOTIF_ERROR, errorMessage, errorPayload);
                    break;
                case ((_g = error.response) === null || _g === void 0 ? void 0 : _g.status) >= 400 && ((_h = error.response) === null || _h === void 0 ? void 0 : _h.status) < 500:
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.NOTIF_REQUEST_ISSUE, errorMessage, errorPayload);
                    break;
                default:
                    logger_1.logger.warn("NotificationsGateway::sendEmail: Notification API email send failed", {
                        errorMessage,
                        errorPayload,
                    });
            }
            throw error;
        }
    }
    async sendRequest(endpoint, payload) {
        const url = `${this.apiUrl}${endpoint}`;
        try {
            const header = await this.getToken();
            logger_1.logger.debug("NotificationsGateway::sendRequest: Raw request payload", {
                url,
                payload,
            });
            const response = await this.axiosRetryClient.post(url, payload, header);
            logger_1.logger.debug("NotificationsGateway::sendRequest: Raw response", {
                url,
                ...response,
            });
        }
        catch (error) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.NOTIF_AUTH_ISSUE, "NotificationsGateway::sendRequest: Post failed", {
                error,
                endpoint,
            });
            throw error;
        }
    }
    async getToken() {
        try {
            return await this.auth.getAuthHeader();
        }
        catch (error) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.NOTIF_AUTH_ISSUE, "NotificationsGateway::getToken: Token call failed", { error });
            throw error;
        }
    }
}
exports.NotificationsGateway = NotificationsGateway;
const notificationsGateway = new NotificationsGateway(new managed_identity_auth_1.ManagedIdentityAuth(config_1.default.notification.identity));
exports.notificationsGateway = notificationsGateway;
