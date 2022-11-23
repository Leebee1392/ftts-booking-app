"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotUnavailableError = exports.SchedulingGateway = void 0;
const config_1 = __importDefault(require("../../config"));
const axios_retry_client_1 = require("../../libraries/axios-retry-client");
const enums_1 = require("../../domain/enums");
const logger_1 = require("../../helpers/logger");
const managed_identity_auth_1 = require("../auth/managed-identity-auth");
const slot_unavailable_error_1 = __importDefault(require("../../domain/errors/slot/slot-unavailable-error"));
exports.SlotUnavailableError = slot_unavailable_error_1.default;
const utc_date_1 = require("../../domain/utc-date");
const slot_invalid_error_1 = __importDefault(require("../../domain/errors/slot/slot-invalid-error"));
const defaultRetryPolicy = config_1.default.scheduling.retryPolicy;
const maxRetriesRetrieve = config_1.default.scheduling.maxRetriesByEndpoint.retrieve;
const maxRetriesReserve = config_1.default.scheduling.maxRetriesByEndpoint.reserve;
const maxRetriesConfirm = config_1.default.scheduling.maxRetriesByEndpoint.confirm;
class SchedulingGateway {
    constructor(auth, axiosRetryClient = new axios_retry_client_1.AxiosRetryClient(defaultRetryPolicy).getClient(), axiosRetryClient_Retrieve = new axios_retry_client_1.AxiosRetryClient({
        ...defaultRetryPolicy,
        maxRetries: maxRetriesRetrieve,
    }).getClient(), axiosRetryClient_Reserve = new axios_retry_client_1.AxiosRetryClient({
        ...defaultRetryPolicy,
        maxRetries: maxRetriesReserve,
    }).getClient(), axiosRetryClient_Confirm = new axios_retry_client_1.AxiosRetryClient({
        ...defaultRetryPolicy,
        maxRetries: maxRetriesConfirm,
    }).getClient(), apiUrl = `${config_1.default.scheduling.baseUrl}/v1`, reservationLockTime = config_1.default.scheduling.lockTime) {
        this.auth = auth;
        this.axiosRetryClient = axiosRetryClient;
        this.axiosRetryClient_Retrieve = axiosRetryClient_Retrieve;
        this.axiosRetryClient_Reserve = axiosRetryClient_Reserve;
        this.axiosRetryClient_Confirm = axiosRetryClient_Confirm;
        this.apiUrl = apiUrl;
        this.reservationLockTime = reservationLockTime;
    }
    static getInstance() {
        return SchedulingGateway.instance;
    }
    async getBooking(bookingProductRef, testCentreRegion) {
        try {
            const authHeader = await this.auth.getAuthHeader();
            const requestUrl = `${this.apiUrl}/tcn/${testCentreRegion}/bookings/${bookingProductRef}`;
            logger_1.logger.debug("SchedulingGateway::getBooking: Attempting to retrieve booking", {
                requestUrl,
                bookingProductRef,
            });
            const response = await this.axiosRetryClient_Retrieve.get(requestUrl, authHeader);
            logger_1.logger.debug("SchedulingGateway::getBooking: API call successful", {
                data: JSON.stringify(response.data),
                bookingProductRef,
            });
            return response.data;
        }
        catch (error) {
            this.logEventByProductRef(error, bookingProductRef, "getBooking");
            logger_1.logger.error(error, "SchedulingGateway::getBooking: GET failed for booking reference", {
                bookingProductRef,
                testCentreRegion,
            });
            throw error;
        }
    }
    async availableSlots(dateFrom, dateTo, centre, testType, preferredDate) {
        var _a;
        const businessIdentifiers = {
            testCentreid: centre.testCentreId,
            accountId: centre.accountId,
            siteId: centre.siteId,
            tcnTestCentreId: centre.ftts_tcntestcentreid,
        };
        const testTypeCode = this.toTestTypeCode(testType);
        try {
            logger_1.logger.debug(`SchedulingGateway::availableSlots: Attempting to get available slots for ${centre.name}`, {
                centre: JSON.stringify(centre),
                dateFrom,
                dateTo,
                testType,
                ...businessIdentifiers,
                preferredDate,
            });
            const authHeader = await this.auth.getAuthHeader();
            const preferredDateQueryParam = preferredDate
                ? `&preferredDate=${preferredDate}`
                : "";
            const requestUrl = `${this.apiUrl}/tcn/${centre.region}/testCentres/${centre.testCentreId}/slots?testTypes=%5B%22${testTypeCode}%22%5D&dateFrom=${dateFrom}&dateTo=${dateTo}${preferredDateQueryParam}`;
            logger_1.logger.debug("SchedulingGateway::availableSlots: Making API call", {
                requestUrl,
                ...businessIdentifiers,
            });
            const slots = await this.axiosRetryClient_Retrieve.get(requestUrl, authHeader);
            logger_1.logger.debug("SchedulingGateway::availableSlots: API call successful", {
                data: JSON.stringify(slots.data),
                ...businessIdentifiers,
            });
            return slots.data;
        }
        catch (error) {
            this.logEventByIdentifiers(error, businessIdentifiers, "availableSlots");
            logger_1.logger.error(error, "SchedulingGateway::availableSlots: Call to scheduling api failed", {
                data: JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data),
                ...businessIdentifiers,
                dateFrom,
                dateTo,
                testType,
                region: centre.region,
            });
            return Promise.reject(error);
        }
    }
    async reserveSlot(centre, testType, startDateTime) {
        var _a;
        const reservationsRequest = [
            {
                testCentreId: centre.testCentreId,
                testTypes: [this.toTestTypeCode(testType)],
                startDateTime,
                quantity: 1,
                lockTime: this.reservationLockTime,
            },
        ];
        const businessIdentifiers = {
            testCentreid: centre.testCentreId,
            accountId: centre.accountId,
            siteId: centre.siteId,
            tcnTestCentreId: centre.ftts_tcntestcentreid,
        };
        if (!utc_date_1.UtcDate.isValidIsoTimeStamp(startDateTime)) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_SLOT_INVALID_ERROR, "SchedulingGateway::reserveSlot: Invalid slot detected. Request to scheduling API not sent.", { ...businessIdentifiers, startDateTime });
            throw new slot_invalid_error_1.default();
        }
        try {
            const authHeader = await this.auth.getAuthHeader();
            logger_1.logger.debug("SchedulingGateway::reserveSlot: Making Reservation", {
                reservationsRequest: JSON.stringify(reservationsRequest),
                ...businessIdentifiers,
            });
            const response = await this.axiosRetryClient_Reserve.post(`${this.apiUrl}/tcn/${centre.region}/reservations`, reservationsRequest, authHeader);
            logger_1.logger.debug("SchedulingGateway::reserveSlot: API call successful", {
                data: JSON.stringify(response.data[0]),
                ...businessIdentifiers,
            });
            return response.data[0];
        }
        catch (error) {
            this.logEventByIdentifiers(error, businessIdentifiers, "reserveSlot");
            logger_1.logger.error(error, "SchedulingGateway::reserveSlot: reserve slot failed", {
                ...businessIdentifiers,
            });
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 409) {
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_SLOT_EXP, "SchedulingGateway::reserveSlot: Received an expired response from Scheduling API", {
                    ...businessIdentifiers,
                });
                throw new slot_unavailable_error_1.default();
            }
            throw error;
        }
    }
    async confirmBooking(bookingRequest, region) {
        const authHeader = await this.auth.getAuthHeader();
        const reservationId = bookingRequest.map((booking) => booking.reservationId);
        const bookingRefId = bookingRequest.map((booking) => booking.bookingReferenceId);
        logger_1.logger.debug("SchedulingGateway::confirmBooking: Attempting to confirm the following bookings", {
            bookingRequest: JSON.stringify(bookingRequest),
            reservationId,
            bookingRefId,
        });
        const bookingResponse = await this.axiosRetryClient_Confirm.post(`${this.apiUrl}/tcn/${region}/bookings`, bookingRequest, authHeader);
        logger_1.logger.debug("SchedulingGateway::confirmBooking: API call successful", {
            response: JSON.stringify(bookingResponse.data),
            reservationId,
            bookingRefId,
        });
        return bookingResponse.data;
    }
    async deleteBooking(bookingProductRef, testCentreRegion) {
        try {
            const authHeader = await this.auth.getAuthHeader();
            const requestUrl = `${this.apiUrl}/tcn/${testCentreRegion}/bookings/${bookingProductRef}`;
            logger_1.logger.debug("SchedulingGateway::deleteBooking: Attempting to delete booking", {
                requestUrl,
                bookingProductRef,
                testCentreRegion,
            });
            await this.axiosRetryClient.delete(requestUrl, authHeader);
            logger_1.logger.debug("SchedulingGateway::deleteBooking: Successfully deleted booking", {
                bookingProductRef,
            });
        }
        catch (error) {
            this.logEventByProductRef(error, bookingProductRef, "deleteBooking");
            logger_1.logger.error(error, "SchedulingGateway::deleteBooking: Delete failed", {
                bookingProductRef,
            });
            throw error;
        }
    }
    async deleteReservation(reservationId, testCentreRegion, bookingProductRef) {
        var _a;
        try {
            const authHeader = await this.auth.getAuthHeader();
            const requestUrl = `${this.apiUrl}/tcn/${testCentreRegion}/reservations/${reservationId}`;
            logger_1.logger.debug("SchedulingGateway::deleteReservation: Attempting to delete reservation", {
                requestUrl,
                reservationId,
                testCentreRegion,
            });
            await this.axiosRetryClient.delete(requestUrl, authHeader);
            logger_1.logger.debug("SchedulingGateway::deleteReservation: Successfully deleted reservation", {
                reservationId,
            });
        }
        catch (error) {
            this.logEventByProductRef(error, bookingProductRef, "deleteReservation");
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                logger_1.logger.warn("SchedulingGateway::deleteReservation: failed to delete non-existing reservation", {
                    reservationId,
                    bookingProductRef,
                });
            }
            else {
                logger_1.logger.error(error, "SchedulingGateway::deleteReservation: Delete failed", {
                    reservationId,
                    bookingProductRef,
                });
                throw error;
            }
        }
    }
    toTestTypeCode(testType) {
        const testTypeCode = SchedulingGateway.TEST_TYPE_CODES.get(testType);
        if (!testTypeCode) {
            throw new Error(`SchedulingGateway::toTestTypeCode: No scheduling mapping for TestType '${testType}'`);
        }
        return testTypeCode;
    }
    logEventByProductRef(error, bookingProductRef, func) {
        var _a;
        const status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
        if (!status) {
            logger_1.logger.error(error, `SchedulingGateway::logEventByProductRef::${func}: Not an axios error`);
        }
        else if (status === 401 || status === 403) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_AUTH_ISSUE, `SchedulingGateway::${func}: Failed to authenticate to the scheduling api`, {
                bookingProductRef,
            });
        }
        else if (status >= 400 && status < 500) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_REQUEST_ISSUE, `SchedulingGateway::${func}: Failed to get request from Scheduling api`, {
                bookingProductRef,
            });
        }
        else if (status >= 500) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_ERROR, `SchedulingGateway::${func}: Failed to communicate with the scheduling API server`, {
                bookingProductRef,
            });
        }
    }
    logEventByIdentifiers(error, businessIdentifiers, func) {
        var _a;
        const status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
        if (!status) {
            logger_1.logger.error(error, `SchedulingGateway::logEventByIdentifiers::${func}: Not an axios error`);
        }
        else if (status === 401 || status === 403) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_AUTH_ISSUE, `SchedulingGateway::${func}: Failed to authenticate to the scheduling api`, {
                ...businessIdentifiers,
            });
        }
        else if (status >= 400 && status < 500) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_REQUEST_ISSUE, `SchedulingGateway::${func}: Failed to get request from Scheduling api`, {
                ...businessIdentifiers,
            });
        }
        else if (status >= 500) {
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_ERROR, `SchedulingGateway::${func}: Failed to communicate with the scheduling API server`, {
                ...businessIdentifiers,
            });
        }
    }
}
exports.SchedulingGateway = SchedulingGateway;
SchedulingGateway.instance = new SchedulingGateway(new managed_identity_auth_1.ManagedIdentityAuth(config_1.default.scheduling.identity));
SchedulingGateway.TEST_TYPE_CODES = new Map([
    [enums_1.TestType.ADIHPT, "ADI_HPT"],
    [enums_1.TestType.ADIP1, "ADI_P1"],
    [enums_1.TestType.ADIP1DVA, "ADI_P1"],
    [enums_1.TestType.AMIP1, "AMI_P1"],
    [enums_1.TestType.CAR, "CAR"],
    [enums_1.TestType.ERS, "ERS"],
    [enums_1.TestType.LGVCPC, "LGV_CPC"],
    [enums_1.TestType.LGVCPCC, "LGV_CPC_C"],
    [enums_1.TestType.LGVHPT, "LGV_HPT"],
    [enums_1.TestType.LGVMC, "LGV_MC"],
    [enums_1.TestType.MOTORCYCLE, "MOTORCYCLE"],
    [enums_1.TestType.PCVCPC, "PCV_CPC"],
    [enums_1.TestType.PCVCPCC, "PCV_CPC_C"],
    [enums_1.TestType.PCVHPT, "PCV_HPT"],
    [enums_1.TestType.PCVMC, "PCV_MC"],
    [enums_1.TestType.TAXI, "TAXI"],
]);
