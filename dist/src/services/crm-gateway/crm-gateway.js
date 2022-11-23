"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRMGateway = void 0;
/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-underscore-dangle */
const cds_retry_1 = require("@dvsa/cds-retry");
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../../config"));
const enums_1 = require("../../domain/enums");
const CrmCreateBookingDataError_1 = require("../../domain/errors/crm/CrmCreateBookingDataError");
const helpers_1 = require("../../helpers");
const crm_helper_1 = require("./crm-helper");
const dynamics_web_api_1 = require("./dynamics-web-api");
const enums_2 = require("./enums");
const maps_1 = require("./maps");
class CRMGateway {
    constructor(dynamicsWebApi) {
        this.dynamicsWebApi = dynamicsWebApi;
    }
    static getInstance() {
        if (!CRMGateway.instance) {
            const dynamicsWebApi = dynamics_web_api_1.dynamicsWebApiClient();
            cds_retry_1.proxifyWithRetryPolicy(dynamicsWebApi, this.retryLog, this.cdsRetryPolicy);
            CRMGateway.instance = new CRMGateway(dynamicsWebApi);
        }
        return CRMGateway.instance;
    }
    async getLicenceNumberRecordsByCandidateId(candidateId, licenceNumber) {
        var _a;
        try {
            helpers_1.logger.info("CRMGateway::getLicenceNumberRecordsByCandidateId: Attempting to retrieve Candidate and Licence from CRM", { candidateId });
            const rawXml = await this.readFile("getLicenceNumberRecordsByCandidateId.xml");
            const xml = rawXml
                .replace("${candidateId}", candidateId)
                .replace("${licenceNumber}", licenceNumber)
                .replace("${evidenceStatus}", enums_2.CRMEvidenceStatus.Approved.toString())
                .replace("${licenceStatecode}", enums_2.CRMStateCode.Active.toString())
                .replace("${contactStatecode}", enums_2.CRMStateCode.Active.toString());
            helpers_1.logger.debug("CRMGateway::getLicenceNumberRecordsByCandidateId: Raw Request", { xml, entity: enums_2.Collection.LICENCES });
            const response = await this.dynamicsWebApi.fetch(enums_2.Collection.LICENCES, xml);
            helpers_1.logger.debug("CRMGateway::getLicenceNumberRecordsByCandidateId: Raw Response", { response, entity: enums_2.Collection.LICENCES });
            if (!((_a = response.value) === null || _a === void 0 ? void 0 : _a.length)) {
                helpers_1.logger.info("CRMGateway::getLicenceNumberRecordsByCandidateId: No licence/candidate found for the given candidate id", { candidateId });
                return undefined;
            }
            const candidate = crm_helper_1.mapToCandidate(response.value[0]);
            helpers_1.logger.info("CRMGateway::getLicenceNumberRecordsByCandidateId: Candidate was mapped from CRM", { candidateId });
            return candidate;
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::getLicenceNumberRecordsByCandidateId: Error retrieving licence/candidate from CRM", { candidateId });
            throw error;
        }
    }
    async createLicence(licenceNumber, address, candidateId) {
        try {
            helpers_1.logger.info("CRMGateway::createLicence: Creating licence record in CRM", {
                candidateId,
            });
            const candidateData = {
                address,
                ownerId: config_1.default.crm.ownerId.dvsa,
            };
            const request = {
                collection: "ftts_licences",
                entity: crm_helper_1.mapToCRMLicence(candidateId, licenceNumber, candidateData),
                returnRepresentation: true,
            };
            helpers_1.logger.debug("CRMGateway::createLicence: Raw Request", {
                request,
                candidateId,
            });
            const response = await this.dynamicsWebApi.createRequest(request);
            helpers_1.logger.debug("CRMGateway::createLicence: Response from CRM", {
                response,
            });
            const licenceId = response.ftts_licenceid;
            helpers_1.logger.info("CRMGateway::createLicence: Successfully created licence in CRM", { candidateId, licenceId });
            return licenceId;
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::createLicence: Could not create licence record for candidate in CRM", { candidateId });
            throw error;
        }
    }
    async createCandidate(candidate) {
        try {
            helpers_1.logger.info("CRMGateway::createCandidate: Creating candidate in CRM");
            const createCandidateRequest = {
                collection: "contacts",
                entity: crm_helper_1.mapToCRMContact({
                    ...candidate,
                    ownerId: config_1.default.crm.ownerId.dvsa,
                }),
                returnRepresentation: true,
            };
            helpers_1.logger.debug("CRMGateway::createCandidate: Raw Request", {
                createCandidateRequest,
            });
            const candidateResponse = await this.dynamicsWebApi.createRequest(createCandidateRequest);
            helpers_1.logger.debug("CRMGateway::createCandidate: Create Candidate Raw Response", { candidateResponse });
            const candidateId = candidateResponse.contactid;
            helpers_1.logger.info("CRMGateway::createCandidate: Successfully created candidate in CRM", { candidateId });
            return candidateId;
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::createCandidate: Could not create candidate record for candidate in CRM", { candidate });
            throw error;
        }
    }
    async updateCandidate(candidateId, candidateDetails) {
        try {
            helpers_1.logger.info("CRMGateway::updateCandidate: Attempting to update candidate details", { candidateId });
            const updatedCandidateDetails = crm_helper_1.mapToCRMContact(candidateDetails);
            const candidateResponse = await this.updateCandidateRequest(candidateId, updatedCandidateDetails);
            helpers_1.logger.debug("CRMGateway::updateCandidate: Successfully updated candidate in CRM", { candidateResponse });
            return crm_helper_1.mapToCandidateResponse(candidateResponse);
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::updateCandidate: Could not update candidate details in CRM", { candidateId });
            throw error;
        }
    }
    async updateLicence(licenceId, candidateId, address) {
        try {
            helpers_1.logger.info("CRMGateway::updateLicence: Attempting to update Licence details", {
                licenceId,
                candidateId,
            });
            const updatedLicenceDetails = crm_helper_1.mapToCRMLicence(candidateId, undefined, {
                address,
            });
            const request = {
                key: licenceId,
                collection: "ftts_licences",
                entity: updatedLicenceDetails,
                returnRepresentation: true,
            };
            helpers_1.logger.debug("CRMGateway::updateLicence: Raw Request", {
                request,
                licenceId,
                candidateId,
            });
            const response = await this.dynamicsWebApi.updateRequest(request);
            helpers_1.logger.debug("CRMGateway::updateLicence: Response from CRM", {
                response,
                licenceId,
                candidateId,
            });
            helpers_1.logger.info("CRMGateway::updateLicence: Successfully updated Licence in CRM", { licenceId, candidateId });
            return response;
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::updateLicence: Could not update Licence details in CRM", { licenceId, candidateId });
            throw error;
        }
    }
    async updateCandidateAndCreateBooking(candidate, booking, additionalSupport, isStandardAccommodation, priceListId) {
        const { candidateId, licenceId } = candidate;
        try {
            helpers_1.logger.info("CRMGateway:updateCandidateAndCreateBooking: Attempting to update candidate details and create booking", {
                candidateId,
                licenceId,
                bookingProduct: booking.bookingProductId,
            });
            if (!candidateId || !licenceId) {
                throw new Error("CRMGateway::updateCandidateAndCreateBooking: Missing required candidate data");
            }
            const updatedCandidateDetails = crm_helper_1.mapToCRMContact({
                // We just need to update contact details here. Everything else will be up to date.
                telephone: candidate.telephone,
                email: candidate.email,
            });
            if (!isStandardAccommodation) {
                candidate.ownerId = config_1.default.crm.ownerId.dvsa;
            }
            this.dynamicsWebApi.startBatch();
            this.updateCandidateRequest(candidateId, updatedCandidateDetails);
            this.createBookingRequest(candidate, booking, additionalSupport, isStandardAccommodation, priceListId);
            const response = await this.dynamicsWebApi.executeBatch();
            helpers_1.logger.debug("CRMGateway::updateCandidateAndCreateBooking: Response from CRM", { response });
            const candidateResponse = crm_helper_1.mapToCandidateResponse(response[0]);
            let bookingResponse = crm_helper_1.mapCRMBookingResponseToBookingResponse(response[1]);
            if (!this.isCreateBookingDataValid(bookingResponse, candidate)) {
                helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_REQUEST_RESPONSE_MISMATCH, "CRMGateway::updateCandidateAndCreateBooking: request-response data mismatch", {
                    candidateId: candidate.candidateId,
                    licenceId: candidate.licenceId,
                    responseBookingId: bookingResponse.id,
                });
                bookingResponse = await this.validateBookingAndRetryIfNeeded(candidate, booking, additionalSupport, isStandardAccommodation, priceListId);
            }
            const candidateAndBookingResponse = {
                booking: bookingResponse,
                candidate: {
                    ...candidateResponse,
                },
            };
            helpers_1.logger.info("CRMGateway::updateCandidateAndCreateBooking: Successful", {
                candidateId,
                licenceId,
                bookingId: candidateAndBookingResponse.booking.id,
                bookingReference: candidateAndBookingResponse.booking.reference,
                bookingProduct: booking.bookingProductId,
            });
            return candidateAndBookingResponse;
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::updateCandidateAndCreateBooking: Could not update candidate or create the booking in CRM", {
                candidateId,
                licenceId,
                bookingProduct: booking.bookingProductId,
            });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_NEW_UPDATE, "CRMGateway::updateCandidateAndCreateBooking: Failed", {
                error,
                candidateId,
                bookingProduct: booking.bookingProductId,
            });
            throw error;
        }
    }
    async validateBookingAndRetryIfNeeded(candidate, booking, additionalSupport, isStandardAccommodation, priceListId) {
        // retry 3 times
        let retries = 3;
        while (retries > 0) {
            helpers_1.logger.info("CRMGateway::validateBookingAndRetryIfNeeded: retry attempt");
            retries--;
            // eslint-disable-next-line no-await-in-loop
            const response = await this.createBookingRequest(candidate, booking, additionalSupport, isStandardAccommodation, priceListId);
            const convertedResponse = crm_helper_1.mapCRMBookingResponseToBookingResponse(response);
            if (this.isCreateBookingDataValid(convertedResponse, candidate)) {
                return convertedResponse;
            }
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_REQUEST_RESPONSE_MISMATCH, "CRMGateway::validateBookingAndRetryIfNeeded: request-response data mismatch", {
                candidateId: candidate.candidateId,
                licenceId: candidate.licenceId,
                responseBookingId: convertedResponse.id,
            });
        }
        throw new CrmCreateBookingDataError_1.CrmCreateBookingDataError("CRMGateway::validateBookingAndRetryIfNeeded: crm returned data from different booking");
    }
    isCreateBookingDataValid(bookingResponse, candidate) {
        return (bookingResponse.firstName === candidate.firstnames &&
            bookingResponse.lastName === candidate.surname &&
            bookingResponse.candidateId === candidate.candidateId &&
            bookingResponse.licenceId === candidate.licenceId);
    }
    async createBookingProduct(candidate, booking, bookingResponse, isStandardAccommodation, additionalSupport) {
        const { candidateId, licenceId } = candidate;
        const { bookingProductId: bookingProduct, bookingId } = booking;
        try {
            helpers_1.logger.info("CRMGateway::createBookingProduct: Creating Booking Product in CRM", {
                candidateId,
                licenceId,
                bookingId: bookingResponse.id,
                bookingRef: bookingResponse.reference,
            });
            const request = {
                collection: "ftts_bookingproducts",
                entity: crm_helper_1.mapToCRMBookingProduct(candidate, booking, bookingResponse, isStandardAccommodation, additionalSupport),
                returnRepresentation: true,
            };
            helpers_1.logger.debug("CRMGateway::createBookingProduct: Raw Request", {
                request,
            });
            const response = await this.dynamicsWebApi.createRequest(request);
            helpers_1.logger.debug("CRMGateway::createBookingProduct: Raw Response", {
                response,
            });
            const bookingProductId = response.ftts_bookingproductid;
            helpers_1.logger.info("CRMGateway::createBookingProduct: Successfully created Booking Product in CRM", {
                candidateId,
                licenceId,
                bookingId: bookingResponse.id,
                bookingRef: bookingResponse.reference,
                bookingProductId,
                bookingProductRef: response.ftts_reference,
            });
            return bookingProductId;
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::createBookingProduct: Could not create booking product entity in CRM", {
                candidateId,
                licenceId,
                bookingId,
                bookingRef: booking === null || booking === void 0 ? void 0 : booking.bookingRef,
                bookingProduct,
            });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_NEW_UPDATE, "CRMGateway::createBookingProduct: Failed", {
                error,
                candidateId,
                licenceId,
                bookingId,
                bookingRef: booking === null || booking === void 0 ? void 0 : booking.bookingRef,
                bookingProduct,
            });
            throw error;
        }
    }
    async rescheduleBookingAndConfirm(bookingId, dateTime, currentRescheduleCount, isCSCBooking, testCentreAccountId, preferredDate, kpiIdentifiers) {
        const rescheduleCount = currentRescheduleCount + 1;
        helpers_1.logger.info("CRMGateway::rescheduleBookingAndConfirm: Attempting to reschedule and confirm booking", { bookingId, dateTime, rescheduleCount });
        const entity = {
            ftts_testdate: dateTime,
            ftts_bookingstatus: enums_2.CRMBookingStatus.Confirmed,
            ftts_callamend: isCSCBooking ? isCSCBooking === null || isCSCBooking === void 0 ? void 0 : isCSCBooking.toString() : undefined,
            ftts_tcnpreferreddate: preferredDate,
            ftts_dateavailableonoraftertoday: kpiIdentifiers === null || kpiIdentifiers === void 0 ? void 0 : kpiIdentifiers.dateAvailableOnOrAfterToday,
            ftts_dateavailableonorbeforepreferreddate: kpiIdentifiers === null || kpiIdentifiers === void 0 ? void 0 : kpiIdentifiers.dateAvailableOnOrBeforePreferredDate,
            ftts_dateavailableonorafterpreferreddate: kpiIdentifiers === null || kpiIdentifiers === void 0 ? void 0 : kpiIdentifiers.dateAvailableOnOrAfterPreferredDate,
            ftts_reschedulecount: rescheduleCount,
        };
        if (testCentreAccountId) {
            entity["ftts_testcentre@odata.bind"] = `accounts(${testCentreAccountId})`;
        }
        try {
            const request = {
                key: bookingId,
                collection: "ftts_bookings",
                entity,
            };
            helpers_1.logger.debug("CRMGateway::rescheduleBookingAndConfirm: Raw Request", {
                request,
            });
            await this.dynamicsWebApi.updateRequest(request);
            helpers_1.logger.info("CRMGateway::rescheduleBookingAndConfirm: Booking rescheduled and confirmed", { bookingId, dateTime });
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::rescheduleBookingAndConfirm: Could not update booking date time and location in CRM", { bookingId, dateTime });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CHANGE_UPDATE, "CRMGateway::rescheduleBookingAndConfirm: Failed", {
                error,
                bookingId,
            });
            throw error;
        }
    }
    async updateBookingStatus(bookingId, crmBookingStatus, isCSCBooking) {
        helpers_1.logger.info("CRMGateway::updateBookingStatus: Attempting to update booking status", { bookingId, crmBookingStatus });
        const request = {
            key: bookingId,
            collection: "ftts_bookings",
            entity: {
                ftts_bookingstatus: crmBookingStatus,
                ftts_callamend: isCSCBooking ? isCSCBooking === null || isCSCBooking === void 0 ? void 0 : isCSCBooking.toString() : undefined,
            },
        };
        helpers_1.logger.debug("CRMGateway::updateBookingStatus: Raw Request", { request });
        try {
            await this.dynamicsWebApi.updateRequest(request);
            helpers_1.logger.info("CRMGateway::updateBookingStatus: Booking status updated", {
                bookingId,
                crmBookingStatus,
            });
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::updateBookingStatus: Could not update booking status in CRM", { bookingId, crmBookingStatus });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CHANGE_UPDATE, "CRMGateway::updateBookingStatus: Could not update booking status in CRM", {
                error,
                bookingId,
            });
            throw error;
        }
    }
    async updateVoiceover(bookingId, bookingProductId, voiceover, isCSCBooking) {
        helpers_1.logger.info("CRMGateway::updateVoiceover: Attempting to update voicover", {
            bookingId,
            bookingProductId,
            voiceover,
        });
        try {
            this.dynamicsWebApi.startBatch();
            this.updateBookingProductVoiceover(bookingProductId, voiceover);
            this.updateBookingVoiceover(bookingId, voiceover, isCSCBooking);
            await this.dynamicsWebApi.executeBatch();
            helpers_1.logger.info("CRMGateway::updateVoiceover: Voiceover updated successfully", { bookingId, bookingProductId, voiceover });
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::updateVoiceover: Could not update voiceover in CRM", { bookingId, bookingProductId, voiceover });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CHANGE_UPDATE, "CRMGateway::updateVoiceover: Could not update voiceover in CRM", {
                error,
                bookingId,
            });
            throw error;
        }
    }
    async updateAdditionalSupport(bookingId, bookingProductId, additionalSupport, isCSCBooking) {
        helpers_1.logger.info("CRMGateway::updateAdditionalSupport: Attempting to update additional support", { bookingId, bookingProductId, additionalSupport });
        try {
            this.dynamicsWebApi.startBatch();
            this.updateProductBookingAdditionalSupport(bookingProductId, additionalSupport);
            this.updateBookingAdditionalSupport(bookingId, additionalSupport, isCSCBooking);
            await this.dynamicsWebApi.executeBatch();
            helpers_1.logger.info("CRMGateway::updateAdditionalSupport: Additional support updated", { bookingId, bookingProductId, additionalSupport });
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::updateAdditionalSupport: Could not update additional support options in CRM", { bookingId, bookingProductId, additionalSupport });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CHANGE_UPDATE, "CRMGateway::updateAdditionalSupport: Could not update additional support options in CRM", {
                error,
                bookingId,
            });
            throw error;
        }
    }
    async updateLanguage(bookingId, bookingProductId, language, isCSCBooking) {
        helpers_1.logger.info("CRMGateway::updateLanguage: Attempting to update language", {
            bookingId,
            bookingProductId,
            language,
        });
        try {
            const updateBookingRequest = {
                key: bookingId,
                collection: "ftts_bookings",
                entity: {
                    ftts_language: language,
                    ftts_callamend: isCSCBooking ? isCSCBooking === null || isCSCBooking === void 0 ? void 0 : isCSCBooking.toString() : undefined,
                },
            };
            const updateBookingProductRequest = {
                key: bookingProductId,
                collection: "ftts_bookingproducts",
                entity: {
                    ftts_testlanguage: language,
                },
            };
            helpers_1.logger.debug("CRMGateway::updateLanguage: Raw Request", {
                updateBookingRequest,
                updateBookingProductRequest,
            });
            this.dynamicsWebApi.startBatch();
            this.dynamicsWebApi.updateRequest(updateBookingRequest);
            this.dynamicsWebApi.updateRequest(updateBookingProductRequest);
            await this.dynamicsWebApi.executeBatch();
            helpers_1.logger.info("CRMGateway::updateLanguage: Language updated successfully", {
                bookingId,
                bookingProductId,
                language,
            });
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::updateLanguage: Could not update language in CRM", { bookingId, bookingProductId, language });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CHANGE_UPDATE, "CRMGateway::updateLanguage: Could not update language in CRM", {
                error,
                bookingId,
            });
            throw error;
        }
    }
    async updateCompensationBooking(bookingId, owedCompensationBookingRecognised) {
        const identifiers = {
            bookingId,
            owedCompensationBookingRecognised,
        };
        helpers_1.logger.info("CRMGateway::updateCompensationBooking: Attempting to update compensation booking", identifiers);
        try {
            await this.updateOwedCompensationBookingRecognised(bookingId, owedCompensationBookingRecognised);
            helpers_1.logger.info("CRMGateway::updateCompensationBooking: Compensation booking has been updated in CRM", identifiers);
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::updateCompensationBooking: Could not update compensation booking in CRM", identifiers);
            throw error;
        }
    }
    /**
     * Only booked or completed tests and only those from the booking app or CSC
     */
    async getCandidateBookings(candidateId) {
        try {
            let normalisedRecords = [];
            if (config_1.default.featureToggles.enableViewNsaBookingSlots) {
                // If a link entity doesn't contain an id, it won't return that record at all so we must split it into two requests
                const [rawStandardXml, rawNsaXml] = await Promise.all([
                    this.readFile("getCandidateBookings.xml"),
                    this.readFile("getNsaDraftCandidateBookings.xml"),
                ]);
                const standardBookingsQuery = rawStandardXml.replace("${candidateId}", candidateId);
                const nsaBookingsQuery = rawNsaXml.replace("${candidateId}", candidateId);
                helpers_1.logger.debug("CRMGateway::getCandidateBookings: Raw XML Request", {
                    standardBookingsQuery,
                    nsaBookingsQuery,
                    entity: enums_2.Collection.BOOKING_PRODUCT,
                });
                this.dynamicsWebApi.startBatch();
                await this.dynamicsWebApi.fetch(enums_2.Collection.BOOKING_PRODUCT, standardBookingsQuery);
                await this.dynamicsWebApi.fetch(enums_2.Collection.BOOKING_PRODUCT, nsaBookingsQuery);
                const response = await this.dynamicsWebApi.executeBatch();
                helpers_1.logger.debug("CRMGateway::getCandidateBookings: Raw XML Response", {
                    response,
                    entity: enums_2.Collection.BOOKING_PRODUCT,
                });
                const [standardBookings, nsaBookings] = [
                    response[0].value,
                    response[1].value,
                ];
                const nsaBookingSlots = await this.getNsaBookingSlots(nsaBookings);
                if (nsaBookingSlots) {
                    // Combine the nsa booking slots with the nsa bookings array (related to booking id)
                    nsaBookings.forEach((nsaBooking) => {
                        if (!nsaBookingSlots.length) {
                            nsaBooking.ftts_nsabookingslots = undefined;
                        }
                        // Go through each booking slot and attach to the booking
                        nsaBookingSlots.forEach((nsaBookingSlot) => {
                            if (nsaBookingSlot._ftts_bookingid_value ===
                                nsaBooking._ftts_bookingid_value) {
                                const bookingSlot = nsaBooking.ftts_nsabookingslots;
                                bookingSlot.push(nsaBookingSlot);
                            }
                        });
                    });
                }
                const records = [...standardBookings, ...nsaBookings];
                normalisedRecords = records.map(crm_helper_1.mapFromCrmXmlBookingDetailsToCRMBookingDetails);
            }
            else {
                const bookingProductFields = [
                    "ftts_bookingproductid",
                    "ftts_reference",
                    "_ftts_bookingid_value",
                    "ftts_bookingstatus",
                    "ftts_testdate",
                    "ftts_testlanguage",
                    "ftts_voiceoverlanguage",
                    "ftts_additionalsupportoptions",
                    "ftts_paymentstatus",
                    "ftts_price",
                    "ftts_salesreference",
                    "createdon",
                ];
                const bookingFields = [
                    "ftts_governmentagency",
                    "ftts_reference",
                    "ftts_origin",
                    "ftts_enableeligibilitybypass",
                    "ftts_nonstandardaccommodation",
                    "ftts_owedcompbookingassigned",
                    "ftts_owedcompbookingrecognised",
                    "ftts_zerocostbooking",
                    "ftts_testsupportneed",
                    "ftts_foreignlanguageselected",
                ];
                const testCentreFields = [
                    "ftts_siteid",
                    "name",
                    "address1_line1",
                    "address1_line2",
                    "address1_city",
                    "address1_county",
                    "address1_postalcode",
                    "ftts_remit",
                    "ftts_fullyaccessible",
                    "_parentaccountid_value",
                    "address1_latitude",
                    "address1_longitude",
                    "accountid",
                    "ftts_tcntestcentreid",
                ];
                const parentAccountFields = [
                    "ftts_regiona",
                    "ftts_regionb",
                    "ftts_regionc",
                ];
                const productFields = [
                    "productid",
                    "_parentproductid_value",
                    "name",
                    "productnumber",
                ];
                const filterQuery = `_ftts_candidateid_value eq ${candidateId} and (ftts_bookingstatus eq ${enums_2.CRMBookingStatus.Confirmed} or ftts_bookingstatus eq ${enums_2.CRMBookingStatus.CompletePassed} or ftts_bookingstatus eq ${enums_2.CRMBookingStatus.CompleteFailed} or ftts_bookingstatus eq ${enums_2.CRMBookingStatus.CancellationInProgress} or ftts_bookingstatus eq ${enums_2.CRMBookingStatus.ChangeInProgress} or ftts_bookingstatus eq ${enums_2.CRMBookingStatus.Cancelled})`;
                const request = {
                    collection: "ftts_bookingproducts",
                    select: bookingProductFields,
                    orderBy: ["ftts_reference desc"],
                    expand: [
                        {
                            property: "ftts_bookingid",
                            select: bookingFields,
                            expand: [
                                {
                                    property: "ftts_testcentre",
                                    select: testCentreFields,
                                    expand: [
                                        {
                                            property: "parentaccountid",
                                            select: parentAccountFields,
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            property: "ftts_productid",
                            select: productFields,
                        },
                    ],
                    filter: filterQuery,
                };
                helpers_1.logger.debug("CRMGateway::getCandidateBookings: Raw Request", {
                    request,
                });
                const response = await this.dynamicsWebApi.retrieveMultipleRequest(request);
                helpers_1.logger.debug("CRMGateway::getCandidateBookings: Raw Response", {
                    response,
                });
                normalisedRecords = response === null || response === void 0 ? void 0 : response.value;
            }
            if (!normalisedRecords.length) {
                helpers_1.logger.debug("CRMGateway::getCandidateBookings: No bookings found for candidate", { candidateId });
                return [];
            }
            const faultyBookingRefs = [];
            const result = normalisedRecords
                .filter((booking) => {
                var _a, _b;
                // Can't filter booking origin on the expand query so filter here instead
                // Only want bookings made from the booking app or CSC
                // And if from CSC payment must be confirmed
                if (booking.ftts_bookingid.ftts_governmentagency === null) {
                    if (booking.ftts_bookingid.ftts_origin === enums_2.CRMOrigin.CitizenPortal ||
                        (booking.ftts_bookingid.ftts_origin ===
                            enums_2.CRMOrigin.CustomerServiceCentre &&
                            booking.ftts_paymentstatus === enums_2.CRMPaymentStatus.Success)) {
                        faultyBookingRefs.push((_a = booking === null || booking === void 0 ? void 0 : booking.ftts_bookingid) === null || _a === void 0 ? void 0 : _a.ftts_reference);
                    }
                    return false;
                }
                // Can't filter Cancelled booking with below properties
                // Filtering Cancelled bookings that are eligible to be rebooked
                if (booking.ftts_bookingstatus === enums_2.CRMBookingStatus.Cancelled) {
                    return (booking.ftts_bookingid.ftts_owedcompbookingassigned !== null &&
                        booking.ftts_bookingid.ftts_owedcompbookingrecognised === null);
                }
                // If from NSA, we want booking status to be draft and for non standard accommodation to be true
                if (booking.ftts_bookingstatus === enums_2.CRMBookingStatus.Draft) {
                    if (!booking.ftts_bookingid.ftts_nonstandardaccommodation) {
                        return false;
                    }
                    if (booking.ftts_bookingid.ftts_nsastatus === null) {
                        faultyBookingRefs.push((_b = booking === null || booking === void 0 ? void 0 : booking.ftts_bookingid) === null || _b === void 0 ? void 0 : _b.ftts_reference);
                        return false;
                    }
                    return true;
                }
                if (booking.ftts_bookingid.ftts_origin === enums_2.CRMOrigin.CitizenPortal) {
                    return true;
                }
                if (booking.ftts_bookingid.ftts_origin ===
                    enums_2.CRMOrigin.CustomerServiceCentre) {
                    return booking.ftts_paymentstatus === enums_2.CRMPaymentStatus.Success;
                }
                return false;
            })
                .map(crm_helper_1.mapToBookingDetails);
            if (faultyBookingRefs.length > 0) {
                helpers_1.logger.debug("CRMGateway::getCandidateBookings: The following bookings are filtered out because of missing data", { faultyBookingRefs, candidateId });
            }
            // We need to retrieve the payment information for any bookings which have the status Cancellation in Progress.
            const resultsThatContainBookingsWithPaymentInformation = await this.getPaymentInformationForBookingDetails(result);
            helpers_1.logger.debug("CRMGateway::getCandidateBookings: result of fetched bookings with bookings also containing payment information", { resultsThatContainBookingsWithPaymentInformation, candidateId });
            return resultsThatContainBookingsWithPaymentInformation;
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::getCandidateBookings: Could not retrieve booking products from CRM", { candidateId });
            throw error;
        }
    }
    async getCandidateCompensatedBookings(candidateId, target) {
        try {
            const rawXml = await this.readFile("getCandidateCompensatedBookings.xml");
            const xml = rawXml
                .replace("${candidateId}", candidateId)
                .replace("${governmentAgency}", target === enums_1.Target.NI
                ? String(enums_2.CRMGovernmentAgency.Dva)
                : String(enums_2.CRMGovernmentAgency.Dvsa));
            helpers_1.logger.debug("CRMGateway::getCandidateCompensatedBookings: Raw Request", {
                xml,
                entity: enums_2.Collection.BOOKING_PRODUCT,
            });
            const response = await this.dynamicsWebApi.fetch(enums_2.Collection.BOOKING_PRODUCT, xml);
            helpers_1.logger.debug("CRMGateway::getCandidateCompensatedBookings: Raw Response", { response, entity: enums_2.Collection.BOOKING_PRODUCT });
            return response.value ? response.value : [];
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::getCandidateCompensatedBookings: Could not retrieve compensated booking from CRM", { candidateId });
            throw error;
        }
    }
    async calculateThreeWorkingDays(testDate, remit) {
        try {
            const request = {
                TestDate: testDate,
                CalendarName: crm_helper_1.mapCRMRemitToCRMCalendarName(remit),
                NoOfDays: -4, // 4 to get date 3 clear working days before
            };
            helpers_1.logger.debug("CRMGateway::calculateThreeWorkingDays: Raw Request", {
                request,
            });
            const response = await this.dynamicsWebApi.executeUnboundAction("ftts_GetClearWorkingDay", request);
            helpers_1.logger.debug("CRMGateway::calculateThreeWorkingDays: Raw Response", {
                response,
            });
            const dueDate = response.DueDate instanceof Date
                ? response.DueDate
                : new Date(response.DueDate);
            const isoDateString = dueDate.toISOString().split("T")[0];
            return isoDateString;
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::calculateThreeWorkingDays: Could not get 3 working days", { testDate, remit });
            return "";
        }
    }
    async updateTCNUpdateDate(bookingProductId) {
        helpers_1.logger.info("CRMGateway::updateTCNUpdateDate: Attempting to update ftts_tcn_update_date", { bookingProductId });
        try {
            const request = {
                key: bookingProductId,
                collection: "ftts_bookingproducts",
                entity: {
                    ftts_tcn_update_date: dayjs_1.default().toISOString(),
                },
            };
            helpers_1.logger.debug("CRMGateway::updateTCNUpdateDate: Raw Request", {
                request,
                bookingProductId,
            });
            await this.dynamicsWebApi.updateRequest(request);
            helpers_1.logger.info("CRMGateway::updateTCNUpdateDate: ftts_tcn_update_date updated successfully", { bookingProductId });
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::updateTCNUpdateDate: Could not set the TCN Update Date on Booking Product ID", { bookingProductId });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CHANGE_UPDATE, "CRMGateway::updateTCNUpdateDate: Could not set the TCN Update Date", { error, bookingProductId });
            throw error;
        }
    }
    async updateBookingStatusPaymentStatusAndTCNUpdateDate(bookingId, bookingProductId, bookingStatus, paymentId, isCSCBooking) {
        helpers_1.logger.info("CRMGateway::updateBookingStatusPaymentStatusAndTCNUpdateDate: Attempting to update", {
            bookingId,
            bookingProductId,
            bookingStatus,
            paymentId,
        });
        let updatePaymentRequest = {};
        try {
            const updateBookingRequest = {
                key: bookingId,
                collection: "ftts_bookings",
                entity: {
                    ftts_bookingstatus: bookingStatus,
                    ftts_callamend: isCSCBooking ? isCSCBooking.toString() : undefined,
                },
            };
            if (paymentId) {
                updateBookingRequest.entity["ftts_payment@odata.bind"] = `/ftts_payments(${paymentId})`;
            }
            const updateBookingProductRequest = {
                key: bookingProductId,
                collection: "ftts_bookingproducts",
                entity: {
                    ftts_tcn_update_date: dayjs_1.default().toISOString(),
                },
            };
            this.dynamicsWebApi.startBatch();
            this.dynamicsWebApi.updateRequest(updateBookingRequest);
            if (bookingStatus === enums_2.CRMBookingStatus.AbandonedNonRecoverable) {
                updatePaymentRequest = {
                    key: paymentId,
                    collection: "ftts_payments",
                    entity: {
                        ftts_status: enums_2.CRMPaymentStatus.UserCancelled,
                    },
                };
                this.dynamicsWebApi.updateRequest(updatePaymentRequest);
            }
            this.dynamicsWebApi.updateRequest(updateBookingProductRequest);
            helpers_1.logger.debug("CRMGateway::updateBookingStatusPaymentStatusAndTCNUpdateDate: Raw Request", {
                updateBookingRequest,
                updateBookingProductRequest,
                updatePaymentRequest,
            });
            await this.dynamicsWebApi.executeBatch();
            helpers_1.logger.info("CRMGateway::updateBookingStatusPaymentStatusAndTCNUpdateDate: Update finished successfully", {
                bookingId,
                bookingProductId,
                bookingStatus,
                paymentId,
            });
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::updateBookingStatusPaymentStatusAndTCNUpdateDate: Batch request failed", {
                bookingId,
                bookingProductId,
                bookingStatus,
            });
            throw error;
        }
    }
    async updateNSABookings(nsaBookings) {
        if (nsaBookings.length >= 1000) {
            const error = Error("CRMGateway::updateNSABookings: The number of NSA bookings to update exceeds a thousand");
            helpers_1.logger.error(error, undefined, {
                numberOfNsaBookings: nsaBookings.length,
            });
            throw error;
        }
        helpers_1.logger.info("CRMGateway::updateNSABookings: Attempting to update", {
            nsaBookings,
        });
        try {
            this.dynamicsWebApi.startBatch();
            // eslint-disable-next-line no-restricted-syntax
            for (const nsaBooking of nsaBookings) {
                if (nsaBooking.crmNsaStatus === enums_2.CRMNsaStatus.AwaitingCscResponse ||
                    nsaBooking.crmNsaStatus === enums_2.CRMNsaStatus.DuplicationsClosed) {
                    const request = {
                        key: nsaBooking.bookingId,
                        collection: "ftts_bookings",
                        entity: {
                            ftts_bookingstatus: enums_2.CRMBookingStatus.NoLongerRequired,
                            ftts_callamend: nsaBooking.origin === enums_2.CRMOrigin.CustomerServiceCentre
                                ? "true"
                                : undefined,
                            ftts_nsastatus: enums_2.CRMNsaStatus.StandardTestBooked,
                        },
                    };
                    helpers_1.logger.debug("CRMGateway::updateNSABookings: Raw Request", {
                        request,
                    });
                    this.dynamicsWebApi.updateRequest(request);
                }
            }
            await this.dynamicsWebApi.executeBatch();
            helpers_1.logger.info("CRMGateway::updateNSABookings: Update finished successfully", {
                nsaBookings,
            });
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::updateNSABookings: Batch request failed", {
                nsaBookings,
            });
            throw error;
        }
    }
    /**
     * Retrieves price list for DVSA/DVA based on the given target. Optionally fetches prices only for the given testTypes.
     */
    async getPriceList(target, testTypes) {
        var _a;
        const priceListId = target === enums_1.Target.NI
            ? config_1.default.crm.priceListId.dva
            : config_1.default.crm.priceListId.dvsa;
        try {
            let filter = `_pricelevelid_value eq ${priceListId}`;
            if (testTypes) {
                const productNumbers = testTypes.map(maps_1.toCRMProductNumber);
                filter += ` and Microsoft.Dynamics.CRM.In(PropertyName='productnumber',PropertyValues=[${productNumbers
                    .map((p) => `'${p}'`)
                    .join(",")}])`;
            }
            const request = {
                collection: "productpricelevels",
                select: ["productnumber", "amount"],
                expand: [
                    {
                        property: "productid",
                        select: ["productid", "_parentproductid_value", "name"],
                    },
                ],
                filter,
            };
            helpers_1.logger.debug("CRMGateway::getPriceList: Raw Request", { request });
            const response = await this.dynamicsWebApi.retrieveMultipleRequest(request);
            helpers_1.logger.debug("CRMGateway::getPriceList: Raw Response", { response });
            if (!((_a = response.value) === null || _a === void 0 ? void 0 : _a.length)) {
                throw new Error("Empty response from CRM");
            }
            const priceList = response.value.map((productPriceLevel) => ({
                testType: maps_1.fromCRMProductNumber(productPriceLevel.productnumber),
                price: productPriceLevel.amount,
                product: {
                    productId: productPriceLevel.productid.productid,
                    parentId: productPriceLevel.productid._parentproductid_value,
                    name: productPriceLevel.productid.name,
                },
            }));
            return priceList;
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::getPriceList: Failed to get price list from CRM", { priceListId, testTypes, target });
            throw error;
        }
    }
    async createBindBetweenBookingAndPayment(bookingId, paymentId, receiptReference) {
        helpers_1.logger.info("CRMGateway::createBindBetweenBookingAndPayment: Attempting to create a bind between a booking and a payment", {
            bookingId,
            paymentId,
            receiptReference,
        });
        try {
            if (!bookingId) {
                throw new Error("bookingId is not defined");
            }
            if (!paymentId) {
                throw new Error("paymentId is not defined");
            }
            const updateRequest = {
                key: bookingId,
                collection: "ftts_bookings",
                entity: {
                    "ftts_payment@odata.bind": `/ftts_payments(${paymentId})`,
                },
            };
            helpers_1.logger.debug("CRMGateway::createBindBetweenBookingAndPayment: Trying to update a booking", {
                updateRequest,
            });
            await this.dynamicsWebApi.updateRequest(updateRequest);
            helpers_1.logger.info("CRMGateway::createBindBetweenBookingAndPayment: Booking updated successfully", {
                bookingId,
                paymentId,
                receiptReference,
            });
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::createBindBetweenBookingAndPayment: Could not create a bind", {
                bookingId,
                paymentId,
                receiptReference,
            });
            throw error;
        }
    }
    async updateZeroCostBooking(bookingId) {
        helpers_1.logger.info("CRMGateway::updateZeroCostBooking: Attempting to update", {
            bookingId,
        });
        try {
            const request = {
                key: bookingId,
                collection: "ftts_bookings",
                entity: {
                    ftts_zerocostbooking: true,
                    ftts_zerocostbookingreason: enums_2.CRMZeroCostBookingReason.EXAMINER,
                },
            };
            helpers_1.logger.debug("CRMGateway::updateZeroCostBooking: Raw Request", {
                request,
                bookingId,
            });
            await this.dynamicsWebApi.updateRequest(request);
            helpers_1.logger.info("CRMGateway::updateZeroCostBooking: Update finished successfully", { bookingId });
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::updateZeroCostBooking: Could not update Booking", { bookingId });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_NEW_UPDATE, "CRMGateway::updateZeroCostBooking: Could not update Booking", { error, bookingId });
            throw error;
        }
    }
    async markBookingCancelled(bookingId, bookingProductId, isCSCBooking) {
        helpers_1.logger.info("CRMGateway::markBookingCancelled: Attempting to update booking status and cancel date", { bookingId, bookingProductId });
        try {
            this.dynamicsWebApi.startBatch();
            const request = {
                key: bookingProductId,
                collection: "ftts_bookingproducts",
                entity: {
                    ftts_canceldate: dayjs_1.default().toISOString(),
                    ftts_cancelreason: enums_2.CRMCancelReason.Other,
                    ftts_cancelreasondetails: "Booking cancelled by candidate online",
                },
            };
            await this.dynamicsWebApi.updateRequest(request);
            this.updateBookingStatus(bookingId, enums_2.CRMBookingStatus.Cancelled, isCSCBooking);
            const response = await this.dynamicsWebApi.executeBatch();
            helpers_1.logger.info("CRMGateway::markBookingCancelled: Booking status and Booking product cancel date updated", { bookingId, bookingProductId });
            helpers_1.logger.debug("CRMGateway::markBookingCancelled:: Raw response", {
                response,
                bookingId,
            });
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::markBookingCancelled: Could not update booking status in CRM", { bookingId, bookingProductId });
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CHANGE_UPDATE, "CRMGateway::markBookingCancelled: Could not update booking status in CRM", {
                error,
                bookingId,
            });
            throw error;
        }
    }
    async updateProductBookingAdditionalSupport(bookingProductId, additionalSupport) {
        const request = {
            key: bookingProductId,
            collection: "ftts_bookingproducts",
            entity: {
                ftts_additionalsupportoptions: additionalSupport, // Only to handle BSL for now.
            },
        };
        helpers_1.logger.debug("CRMGateway::updateProductBookingAdditionalSupport: Raw Request", { request, bookingProductId });
        return this.dynamicsWebApi.updateRequest(request);
    }
    async updateBookingAdditionalSupport(bookingId, additionalSupport, isCSCBooking) {
        const request = {
            key: bookingId,
            collection: "ftts_bookings",
            entity: {
                ftts_additionalsupportoptions: additionalSupport,
                ftts_callamend: isCSCBooking ? isCSCBooking === null || isCSCBooking === void 0 ? void 0 : isCSCBooking.toString() : undefined,
            },
        };
        helpers_1.logger.debug("CRMGateway::updateBookingAdditionalSupport: Raw Request", {
            request,
            bookingId,
        });
        return this.dynamicsWebApi.updateRequest(request);
    }
    async updateBookingProductVoiceover(bookingProductId, voiceover) {
        const request = {
            key: bookingProductId,
            collection: "ftts_bookingproducts",
            entity: {
                ftts_voiceoverlanguage: voiceover,
            },
        };
        helpers_1.logger.debug("CRMGateway::updateBookingProductVoiceover: Raw Request", {
            request,
            bookingProductId,
        });
        return this.dynamicsWebApi.updateRequest(request);
    }
    async updateCandidateRequest(candidateId, updatedCandidateDetails) {
        const request = {
            key: candidateId,
            collection: "contacts",
            entity: updatedCandidateDetails,
            returnRepresentation: true,
        };
        helpers_1.logger.debug("CRMGateway::updateCandidateRequest: Raw Request", {
            request,
            candidateId,
        });
        return this.dynamicsWebApi.updateRequest(request);
    }
    async updateBookingVoiceover(bookingId, voiceover, isCSCBooking) {
        const request = {
            key: bookingId,
            collection: "ftts_bookings",
            entity: {
                ftts_nivoiceoveroptions: voiceover,
                ftts_callamend: isCSCBooking ? isCSCBooking === null || isCSCBooking === void 0 ? void 0 : isCSCBooking.toString() : undefined,
            },
        };
        helpers_1.logger.debug("CRMGateway::updateBookingVoiceover: Raw Request", {
            request,
            bookingId,
        });
        return this.dynamicsWebApi.updateRequest(request);
    }
    async updateOwedCompensationBookingRecognised(bookingId, owedCompensationBookingRecognised) {
        const request = {
            key: bookingId,
            collection: "ftts_bookings",
            entity: {
                ftts_owedcompbookingrecognised: owedCompensationBookingRecognised,
            },
        };
        helpers_1.logger.debug("CRMGateway:updateOwedCompensationBookingRecognised: Raw Request", { request, bookingId });
        return this.dynamicsWebApi.updateRequest(request);
    }
    async getPaymentInformationForBookingDetails(bookingDetails) {
        if (bookingDetails.length === 0) {
            return [];
        }
        const filteredBookings = bookingDetails.filter((booking) => booking.bookingStatus === enums_2.CRMBookingStatus.CancellationInProgress);
        if (filteredBookings.length === 0) {
            return bookingDetails;
        }
        try {
            this.dynamicsWebApi.startBatch();
            filteredBookings.forEach((bookingDetail) => {
                this.dynamicsWebApi.retrieveMultipleRequest({
                    collection: "ftts_financetransactions",
                    select: ["ftts_type", "ftts_status", "_ftts_bookingproduct_value"],
                    expand: [
                        {
                            property: "ftts_payment",
                            select: ["ftts_status"],
                        },
                    ],
                    filter: `_ftts_bookingproduct_value eq ${bookingDetail.bookingProductId}`,
                });
            });
            const results = await this.dynamicsWebApi.executeBatch();
            helpers_1.logger.debug("CRMGateway::getPaymentInformationForBookingDetails: Raw Response", { results });
            let updatedBookingDetails = [...bookingDetails];
            results.forEach((result) => {
                if (result.value.length === 0) {
                    return;
                }
                updatedBookingDetails = updatedBookingDetails.map((bookingDetail) => {
                    // eslint-disable-next-line no-underscore-dangle
                    if (bookingDetail.bookingProductId ===
                        result.value[0]._ftts_bookingproduct_value) {
                        return crm_helper_1.mapPaymentInformationToBookingDetails(result.value[0], bookingDetail);
                    }
                    return bookingDetail;
                });
            });
            return updatedBookingDetails;
        }
        catch (error) {
            helpers_1.logger.error(error, `CRMGateway::getPaymentInformationForBookingDetails: Could not retrieve payment information for bookings that have the status Cancellation in Progress- ${error.message}`);
            throw error;
        }
    }
    async createBookingRequest(candidate, booking, additionalSupport, isStandardAccommodation, priceListId) {
        const request = {
            collection: "ftts_bookings",
            entity: crm_helper_1.mapToCRMBooking(candidate, booking, candidate.candidateId, candidate.licenceId, additionalSupport, isStandardAccommodation, priceListId),
            returnRepresentation: true,
        };
        helpers_1.logger.debug("CRMGateway::createBookingRequest: Raw Request", { request });
        return this.dynamicsWebApi.createRequest(request);
    }
    async getNsaBookingSlots(nsaBookings) {
        const rawNsaBookingSlotXml = await this.readFile("getNsaBookingSlots.xml");
        let filterQuery = "";
        if (!nsaBookings) {
            return undefined;
        }
        nsaBookings.forEach((nsaBooking) => {
            nsaBooking.ftts_nsabookingslots = [];
            const bookingId = nsaBooking._ftts_bookingid_value;
            filterQuery = filterQuery.concat(`<condition attribute="ftts_bookingid" operator="eq" value="${bookingId}" />\n`);
        });
        const nsaBookingSlotQuery = rawNsaBookingSlotXml.replace("${bookingidConditions}", filterQuery);
        helpers_1.logger.debug("CRMGateway::getNsaBookingSlots: Raw XML Request", {
            nsaBookingSlotQuery,
            entity: enums_2.Collection.NSA_BOOKING_SLOTS,
        });
        const response = await this.dynamicsWebApi.fetch(enums_2.Collection.NSA_BOOKING_SLOTS, nsaBookingSlotQuery);
        const nsaBookingSlots = response.value;
        helpers_1.logger.debug("CRMGateway::getNsaBookingSlots: Raw XML Response", {
            nsaBookingSlots,
            entity: enums_2.Collection.NSA_BOOKING_SLOTS,
        });
        return nsaBookingSlots;
    }
    async getUserDraftNSABookingsIfExist(candidateId, testType) {
        var _a;
        if (config_1.default.featureToggles.enableExistingBookingValidation === false) {
            return Promise.resolve(undefined);
        }
        try {
            const rawXml = await this.readFile("getDraftNSABookings.xml");
            const xml = rawXml
                .replace("${candidateId}", candidateId)
                .replace("${testType}", maps_1.toCRMProductNumber(testType));
            helpers_1.logger.debug("CRMGateway::getUserDraftNSABookingsIfExist: Raw Request", {
                xml,
                entity: enums_2.Collection.BOOKING_PRODUCT,
            });
            const response = await this.dynamicsWebApi.fetch(enums_2.Collection.BOOKING_PRODUCT, xml);
            helpers_1.logger.debug("CRMGateway::getUserDraftNSABookingsIfExist: Raw Response", {
                response,
                entity: enums_2.Collection.BOOKING_PRODUCT,
                candidateId,
            });
            if (!((_a = response.value) === null || _a === void 0 ? void 0 : _a.length)) {
                helpers_1.logger.debug("CRMGateway::getUserDraftNSABookingsIfExist: No draft bookings found for candidate", { candidateId });
                return undefined;
            }
            return response.value.map((booking) => ({
                bookingId: booking["ftts_booking.ftts_bookingid"],
                nsaStatus: booking["ftts_booking.ftts_nsastatus"],
                origin: booking["ftts_booking.ftts_origin"],
            }));
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::getUserDraftNSABookingsIfExist: Could not retrieve NSA draft booking from CRM", { candidateId });
            throw error;
        }
    }
    async doesCandidateHaveExistingBookingsByTestType(candidateId, testType) {
        var _a;
        try {
            const rawXml = await this.readFile("getCandidateBookingsByCurrentTestType.xml");
            const xml = rawXml
                .replace("${candidateId}", candidateId)
                .replace("${testType}", maps_1.toCRMProductNumber(testType))
                .replace("${BOOKING_STATUS_CONFIRMED}", enums_2.CRMBookingStatus.Confirmed.toString())
                .replace("${DATE_NOW}", new Date().toISOString());
            helpers_1.logger.debug("CRMGateway::doesCandidateHaveExistingBookingsByTestType: Raw Request", {
                xml,
                entity: enums_2.Collection.BOOKING_PRODUCT,
                candidateId,
                testType,
            });
            const response = await this.dynamicsWebApi.fetch(enums_2.Collection.BOOKING_PRODUCT, xml);
            helpers_1.logger.debug("CRMGateway::doesCandidateHaveExistingBookingsByTestType: Raw Response", {
                response,
                entity: enums_2.Collection.BOOKING_PRODUCT,
                candidateId,
                testType,
            });
            if (!((_a = response.value) === null || _a === void 0 ? void 0 : _a.length)) {
                helpers_1.logger.debug("CRMGateway::doesCandidateHaveExistingBookingsByTestType: No bookings found with existing test type for candidate", { candidateId, testType });
                return false;
            }
            return true;
        }
        catch (error) {
            this.logGeneralError(error, "CRMGateway::doesCandidateHaveExistingBookingsByTestType: Could not retrieve candidate bookings from CRM", { candidateId, testType });
            throw error;
        }
    }
    /**
     * Retrieves the number of times a booking has been rescheduled.
     */
    async getRescheduleCount(bookingId) {
        try {
            const request = {
                collection: "ftts_bookings",
                select: ["ftts_reschedulecount"],
                key: bookingId,
            };
            helpers_1.logger.debug("CRMGateway::getRescheduleCount: Raw Request", { request });
            const response = await this.dynamicsWebApi.retrieveRequest(request);
            helpers_1.logger.debug("CRMGateway::getRescheduleCount: Raw Response", {
                response,
            });
            if (!response) {
                throw new Error("CRMGateway::getRescheduleCount: Empty response from CRM");
            }
            if (!response.ftts_reschedulecount) {
                return 0;
            }
            return response.ftts_reschedulecount;
        }
        catch (error) {
            helpers_1.logger.error(error, "CRMGateway::getRescheduleCount: Failed to get reschdule count from CRM", { bookingId });
            throw error;
        }
    }
    logGeneralError(error, message, props) {
        helpers_1.logger.error(error, message, props);
        if (error.status === 401 || error.status === 403) {
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_AUTH_ISSUE, message, {
                error,
                ...props,
            });
        }
        if (error.status >= 400 && error.status < 500) {
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_REQUEST_ISSUE, message, {
                error,
                ...props,
            });
        }
        if (error.status >= 500 && error.status < 600) {
            helpers_1.logger.event(helpers_1.BusinessTelemetryEvents.CDS_ERROR, message, {
                error,
                ...props,
            });
        }
    }
    async readFile(fileName) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        return fs_1.default.promises.readFile(`./src/services/crm-gateway/data/${fileName}`, "utf-8");
    }
    static retryLog(warnMessage, properties) {
        helpers_1.logger.warn(warnMessage, properties);
    }
}
exports.CRMGateway = CRMGateway;
CRMGateway.cdsRetryPolicy = config_1.default.crm.retryPolicy;
