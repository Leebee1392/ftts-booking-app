"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsGateway = void 0;
const config_1 = __importDefault(require("../../config"));
const logger_1 = require("../../helpers/logger");
const axios_retry_client_1 = require("../../libraries/axios-retry-client");
const managed_identity_auth_1 = require("../auth/managed-identity-auth");
class LocationsGateway {
    constructor(auth = new managed_identity_auth_1.ManagedIdentityAuth(config_1.default.location.identity), axiosRetryClient = new axios_retry_client_1.AxiosRetryClient(config_1.default.location.retryPolicy).getClient()) {
        this.auth = auth;
        this.axiosRetryClient = axiosRetryClient;
    }
    async fetchCentres(term, region, numberOfResults) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        try {
            const encodedTerm = encodeURIComponent(term);
            const authHeader = await this.auth.getAuthHeader();
            const url = `${config_1.default.location.baseUrl}v1/test-centres?region=${region}&term=${encodedTerm}&numberOfResults=${numberOfResults}`;
            logger_1.logger.debug(`LocationsGateway::fetchCentres: Attempting to get test centres using url ${url}`);
            const centresResponse = await this.axiosRetryClient.get(url, authHeader);
            logger_1.logger.debug("LocationsGateway::fetchCentres: Locations Response", {
                response: centresResponse.data,
            });
            if (centresResponse &&
                centresResponse.data &&
                Array.isArray(centresResponse.data.testCentres)) {
                centresResponse.data.testCentres.forEach((centre) => {
                    centre.testCentreId = centre.ftts_tcntestcentreid;
                });
                return centresResponse.data.testCentres;
            }
            return [];
        }
        catch (error) {
            const eventPayload = {
                message: error.message,
                response: error.response,
                region,
                term,
            };
            logger_1.logger.error(error, `LocationsGateway::fetchCentres: Error retrieving test centres from locations api. Term: ${term} Region: ${region}`);
            if (((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status) === 401 ||
                ((_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.status) === 403) {
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.LOC_AUTH_ISSUE, "LocationsGateway::fetchCentres: Bad Request - Geocoding api was not able to translate search term into location", {
                    message: eventPayload.message,
                    term: eventPayload.term,
                    region: eventPayload.region,
                    ...eventPayload.response,
                });
            }
            if (((_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.status) < 500) {
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.LOC_REQUEST_ISSUE, "LocationsGateway::fetchCentres: Bad Request - Geocoding api was not able to translate search term into location", {
                    message: eventPayload.message,
                    term: eventPayload.term,
                    region: eventPayload.region,
                    ...eventPayload.response,
                });
            }
            if (((_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.status) >= 500) {
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.LOC_ERROR, "LocationsGateway::fetchCentres: Bad Request - Geocoding api was not able to translate search term into location", {
                    message: eventPayload.message,
                    term: eventPayload.term,
                    region: eventPayload.region,
                    ...eventPayload.response,
                });
            }
            if (((_k = (_j = error === null || error === void 0 ? void 0 : error.response) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.status) === 400 &&
                error.response.data.message ===
                    "Bad Request - Geocoding api was not able to translate search term into location") {
                return [];
            }
            throw error;
        }
    }
}
exports.LocationsGateway = LocationsGateway;
exports.default = new LocationsGateway();
