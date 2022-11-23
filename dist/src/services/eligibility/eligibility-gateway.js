"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityGateway = void 0;
const ftts_eligibility_api_model_1 = require("@dvsa/ftts-eligibility-api-model");
const logger_1 = require("../../helpers/logger");
const config_1 = __importDefault(require("../../config"));
const axios_retry_client_1 = require("../../libraries/axios-retry-client");
const managed_identity_auth_1 = require("../auth/managed-identity-auth");
const enums_1 = require("../../domain/enums");
const EligibilityTooManyRequestsError_1 = require("../../domain/errors/eligibility/EligibilityTooManyRequestsError");
const EligibilityServerError_1 = require("../../domain/errors/eligibility/EligibilityServerError");
const EligibilityAuthError_1 = require("../../domain/errors/eligibility/EligibilityAuthError");
const EligibilityLicenceNotFoundError_1 = require("../../domain/errors/eligibility/EligibilityLicenceNotFoundError");
const EligibilityNotLatestLicenceError_1 = require("../../domain/errors/eligibility/EligibilityNotLatestLicenceError");
const EligibilityRetrieveError_1 = require("../../domain/errors/eligibility/EligibilityRetrieveError");
class EligibilityGateway {
    constructor(auth, axiosRetryClient = new axios_retry_client_1.AxiosRetryClient(config_1.default.eligibility.retryPolicy).getClient()) {
        this.auth = auth;
        this.axiosRetryClient = axiosRetryClient;
    }
    static getInstance() {
        if (!EligibilityGateway.instance) {
            EligibilityGateway.instance = new EligibilityGateway(new managed_identity_auth_1.ManagedIdentityAuth(config_1.default.eligibility.identity));
        }
        return EligibilityGateway.instance;
    }
    async getEligibility(drivingLicenceNumber, isManageBooking, target, locale) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const eligibilityAxiosUrl = `${config_1.default.eligibility.baseUrl}v1/eligibility`;
        const eligibilityRequestPayload = {
            drivingLicenceNumber,
            manageBooking: isManageBooking || false,
        };
        try {
            const authHeader = await this.auth.getAuthHeader();
            const response = await this.axiosRetryClient.post(eligibilityAxiosUrl, eligibilityRequestPayload, authHeader);
            logger_1.logger.debug("EligibilityGateway::getEligibility: Raw Response", {
                response: response.data,
            });
            return this.mapEligibilityResponseToCandidate(response.data);
        }
        catch (error) {
            logger_1.logger.debug("EligibilityGateway::getEligibility: Raw error response", {
                errorResponse: error === null || error === void 0 ? void 0 : error.response,
            });
            const err = error;
            if (err === null || err === void 0 ? void 0 : err.response) {
                if (((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) === 409) {
                    logger_1.logger.warn("EligibilityGateway::getEligibility: Not most recent licence, response 409");
                    throw new EligibilityNotLatestLicenceError_1.EligibilityNotLatestLicenceError("Not most recent licence, response 409");
                }
                if (((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status) === 429) {
                    logger_1.logger.error(err, "EligibilityGateway::getEligibility: Eligibility retries limit exceeded, response 429");
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.ELIGIBILITY_REQUEST_ISSUE, "EligibilityGateway::getEligibility: Eligibility retries limit exceeded, response 429", { error });
                    throw new EligibilityTooManyRequestsError_1.EligibilityTooManyRequestsError();
                }
                if (((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.status) >= 500 && ((_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.status) < 600) {
                    logger_1.logger.error(err, "EligibilityGateway::getEligibility: Eligibility service internal server error");
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.ELIGIBILITY_ERROR, "EligibilityGateway::getEligibility: Eligibility service internal server error", { error });
                    throw new EligibilityServerError_1.EligibilityServerError(`${(_e = err === null || err === void 0 ? void 0 : err.response) === null || _e === void 0 ? void 0 : _e.status}`);
                }
                if (((_f = err === null || err === void 0 ? void 0 : err.response) === null || _f === void 0 ? void 0 : _f.status) === 401 || ((_g = err === null || err === void 0 ? void 0 : err.response) === null || _g === void 0 ? void 0 : _g.status) === 403) {
                    // Non-retryable errors. Generic error page shown.
                    logger_1.logger.error(err, "EligibilityGateway::getEligibility: Eligibility authorisation error");
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.ELIGIBILITY_AUTH_ISSUE, "EligibilityGateway::getEligibility: Eligibility authorisation error", { error });
                    throw new EligibilityAuthError_1.EligibilityAuthError(`${(_h = err === null || err === void 0 ? void 0 : err.response) === null || _h === void 0 ? void 0 : _h.status}`);
                }
                if (((_j = err === null || err === void 0 ? void 0 : err.response) === null || _j === void 0 ? void 0 : _j.status) === 404 || ((_k = err === null || err === void 0 ? void 0 : err.response) === null || _k === void 0 ? void 0 : _k.status) === 400) {
                    logger_1.logger.warn("EligibilityGateway::getEligibility: Driver Licence Number was not found", {
                        target,
                        locale,
                        drivingLicenceNumberLength: drivingLicenceNumber.length,
                    });
                    throw new EligibilityLicenceNotFoundError_1.EligibilityLicenceNotFoundError("Driver Licence Number was not found");
                }
            }
            logger_1.logger.error(err, "EligibilityGateway::getEligibility: Failed to retrive candidates eligibility");
            throw new EligibilityRetrieveError_1.EligibilityRetrieveError(error === null || error === void 0 ? void 0 : error.message);
        }
    }
    mapEligibilityResponseToCandidate(data) {
        return {
            title: data.candidateDetails.title,
            firstnames: data.candidateDetails.name,
            surname: data.candidateDetails.surname,
            gender: data.candidateDetails.gender,
            dateOfBirth: data.candidateDetails.dateOfBirth,
            address: data.candidateDetails.address,
            eligibleToBookOnline: data.candidateDetails.eligibleToBookOnline,
            behaviouralMarker: data.candidateDetails.behaviouralMarker,
            behaviouralMarkerExpiryDate: data.candidateDetails.behaviouralMarkerExpiryDate,
            candidateId: data.candidateDetails.candidateId,
            eligibilities: data.eligibilities
                .filter((eligibility) => {
                const testType = EligibilityGateway.ELIGIBILITY_TEST_TYPE_MAP.get(eligibility.testType);
                if (testType === undefined) {
                    logger_1.logger.warn(`EligibilityGateway::mapEligibilityResponseToCandidate Unknown Test Type: ${eligibility.testType}`);
                }
                return testType !== undefined;
            })
                .map((eligibility) => ({
                ...eligibility,
                testType: EligibilityGateway.ELIGIBILITY_TEST_TYPE_MAP.get(eligibility.testType),
                eligibleFrom: typeof eligibility.eligibleFrom === "string"
                    ? eligibility.eligibleFrom
                    : undefined,
                eligibleTo: typeof eligibility.eligibleTo === "string"
                    ? eligibility.eligibleTo
                    : undefined,
            })),
        };
    }
}
exports.EligibilityGateway = EligibilityGateway;
EligibilityGateway.ELIGIBILITY_TEST_TYPE_MAP = new Map([
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.CAR, enums_1.TestType.CAR],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.LGVCPC, enums_1.TestType.LGVCPC],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.LGVCPCC, enums_1.TestType.LGVCPCC],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.LGVHPT, enums_1.TestType.LGVHPT],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.LGVMC, enums_1.TestType.LGVMC],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.MOTORCYCLE, enums_1.TestType.MOTORCYCLE],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.PCVCPC, enums_1.TestType.PCVCPC],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.PCVCPCC, enums_1.TestType.PCVCPCC],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.PCVHPT, enums_1.TestType.PCVHPT],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.PCVMC, enums_1.TestType.PCVMC],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.TAXI, enums_1.TestType.TAXI],
    /* DVSA Instructor Types */
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.ADIP1, enums_1.TestType.ADIP1],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.ADIHPT, enums_1.TestType.ADIHPT],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.ERS, enums_1.TestType.ERS],
    /* DVA Instructor Types */
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.ADIP1DVA, enums_1.TestType.ADIP1DVA],
    [ftts_eligibility_api_model_1.ELIG.Eligibility.TestTypeEnum.AMIP1, enums_1.TestType.AMIP1],
]);
