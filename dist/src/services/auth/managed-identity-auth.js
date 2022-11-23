"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagedIdentityAuth = void 0;
const ftts_auth_client_1 = require("@dvsa/ftts-auth-client");
const logger_1 = require("../../helpers/logger");
class ManagedIdentityAuth {
    constructor(config) {
        this.config = config;
        const sources = [
            new ftts_auth_client_1.ManagedIdentityCredential(config.userAssignedEntityClientId),
        ];
        if (config.azureTenantId &&
            config.azureClientId &&
            config.azureClientSecret) {
            sources.push(new ftts_auth_client_1.ClientSecretCredential(config.azureTenantId, config.azureClientId, config.azureClientSecret));
        }
        this.tokenCredential = new ftts_auth_client_1.ChainedTokenCredential(...sources);
    }
    async getAuthHeader() {
        const token = await this.getToken();
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    async getToken() {
        try {
            const activeToken = await this.tokenCredential.getToken(this.config.scope);
            return activeToken === null || activeToken === void 0 ? void 0 : activeToken.token;
        }
        catch (error) {
            logger_1.logger.error(error, "ManagedIdentityAuth::getToken: Unable to retrieve token", {
                scope: this.config.scope,
                clientId: this.config.userAssignedEntityClientId,
            });
            throw error;
        }
    }
}
exports.ManagedIdentityAuth = ManagedIdentityAuth;
