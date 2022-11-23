"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicsWebApiClient = exports.acquireToken = void 0;
const ftts_auth_client_1 = require("@dvsa/ftts-auth-client");
const dynamics_web_api_1 = __importDefault(require("dynamics-web-api"));
const config_1 = __importDefault(require("../../config"));
const logger_1 = require("../../helpers/logger");
const multiUserEnabled = config_1.default.crm.auth.multipleApplicationUsers.enabled;
const multiUserManagedIdentityCredential = new ftts_auth_client_1.MultiUserManagedIdentityCredential(config_1.default.crm.auth.multipleApplicationUsers.clientIds);
const sources = [
    multiUserEnabled
        ? multiUserManagedIdentityCredential
        : new ftts_auth_client_1.ManagedIdentityCredential(config_1.default.crm.auth.userAssignedEntityClientId),
];
if (config_1.default.crm.auth.tenantId &&
    config_1.default.crm.auth.clientId &&
    config_1.default.crm.auth.clientSecret) {
    sources.push(new ftts_auth_client_1.ClientSecretCredential(config_1.default.crm.auth.tenantId, config_1.default.crm.auth.clientId, config_1.default.crm.auth.clientSecret));
}
const chainedTokenCredential = new ftts_auth_client_1.ChainedTokenCredential(...sources);
logger_1.logger.debug("dynamicsWebApi: Token credential configured", {
    multiUserEnabled,
});
const acquireToken = async (dynamicsWebApiCallback) => {
    let accessToken;
    try {
        accessToken = await chainedTokenCredential.getToken(config_1.default.crm.auth.scope);
    }
    catch (e) {
        logger_1.logger.error(e, `dynamicsWebApi::acquireToken: Failed to acquire token: ${e.message}`, { multiUserEnabled });
    }
    logger_1.logger.debug("dynamicsWebApi::acquireToken: Token acquired", {
        multiUserEnabled,
        userAssignedClientId: multiUserEnabled
            ? multiUserManagedIdentityCredential.getMostRecentlyPickedClientId()
            : config_1.default.crm.auth.userAssignedEntityClientId,
        isEmpty: accessToken == null,
    });
    dynamicsWebApiCallback(accessToken ? accessToken.token : "");
};
exports.acquireToken = acquireToken;
function dynamicsWebApiClient() {
    logger_1.logger.debug("dynamicsWebApiClient::config", {
        scope: config_1.default.crm.auth.scope,
        clientIds: config_1.default.crm.auth.multipleApplicationUsers.clientIds,
    });
    return new dynamics_web_api_1.default({
        webApiUrl: `${config_1.default.crm.apiUrl}/`,
        onTokenRefresh: exports.acquireToken,
    });
}
exports.dynamicsWebApiClient = dynamicsWebApiClient;
