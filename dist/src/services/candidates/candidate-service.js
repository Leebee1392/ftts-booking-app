"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const eligibility_1 = require("../../domain/eligibility");
const enums_1 = require("../../domain/enums");
const CrmCreateUpdateCandidateError_1 = require("../../domain/errors/crm/CrmCreateUpdateCandidateError");
const CrmRetrieveLicenceError_1 = require("../../domain/errors/crm/CrmRetrieveLicenceError");
const CrmServerError_1 = require("../../domain/errors/crm/CrmServerError");
const CrmTooManyRequestsError_1 = require("../../domain/errors/crm/CrmTooManyRequestsError");
const EligbilityCandidateMismatchError_1 = require("../../domain/errors/eligibility/EligbilityCandidateMismatchError");
const EligibilityNotEligibleError_1 = require("../../domain/errors/eligibility/EligibilityNotEligibleError");
const AgencyMismatchError_1 = require("../../domain/errors/login/AgencyMismatchError");
const MultipleCandidateMatchError_1 = require("../../domain/errors/MultipleCandidateMatchError");
const licence_number_1 = require("../../domain/licence-number");
const logger_1 = require("../../helpers/logger");
const sanitisation_1 = require("../../helpers/sanitisation");
const crm_address_mapper_1 = require("../crm-gateway/crm-address-mapper");
const enums_2 = require("../crm-gateway/enums");
class CandidateService {
    constructor(crmGateway, eligibilityGateway) {
        this.crmGateway = crmGateway;
        this.eligibilityGateway = eligibilityGateway;
    }
    async getManageBookingEligibility(licenceNumber, target, locale) {
        return this.eligibilityGateway.getEligibility(licenceNumber, true, target, locale);
    }
    async getEligibility(licenceNumber, candidateDetails, target, locale, isManageBooking, isInstructor) {
        var _a, _b;
        let candidateEligibility;
        candidateEligibility = await this.eligibilityGateway.getEligibility(licenceNumber, isManageBooking, target, locale);
        if (isInstructor) {
            // For instructor, this check needs to be performed first, before doesCandidateMatchEligibility. for candidates it is the opposite
            const eligibleInstructor = (_a = candidateEligibility.eligibilities) === null || _a === void 0 ? void 0 : _a.find((eligibility) => eligibility_1.isInstructorBookable(eligibility, target));
            if (!eligibleInstructor || !candidateEligibility.eligibleToBookOnline) {
                logger_1.logger.debug("CandidateService::getEligibility: Candidate is not eligible to book online", {
                    eligible: eligibleInstructor,
                    eligibleToBookOnline: candidateEligibility.eligibleToBookOnline,
                    isInstructor,
                });
                throw new EligibilityNotEligibleError_1.EligibilityNotEligibleError("Candidate is not eligible to book");
            }
        }
        if (!this.doesCandidateMatchEligibility(candidateDetails, candidateEligibility, target, locale, isInstructor)) {
            logger_1.logger.debug("CandidateService::getEligibility: Candidate details do not match eligibility details", { candidateDetails, candidateEligibility, isInstructor });
            throw new EligbilityCandidateMismatchError_1.EligbilityCandidateMismatchError("Candidate does not match eligibility details");
        }
        if (!isInstructor) {
            const eligible = (_b = candidateEligibility.eligibilities) === null || _b === void 0 ? void 0 : _b.find((eligibility) => eligibility_1.isBookable(eligibility, target));
            if (!eligible || !candidateEligibility.eligibleToBookOnline) {
                logger_1.logger.warn("CandidateService::getEligibility: Candidate is not eligible to book online", {
                    bookableEligibility: eligible
                        ? "Bookable eligibility found"
                        : "No eligibile tests found",
                    eligibleToBookOnline: candidateEligibility.eligibleToBookOnline,
                    isInstructor,
                });
                logger_1.logger.debug("CandidateService::getEligibility: Candidate is not eligible to book online", {
                    eligible,
                    eligibleToBookOnline: candidateEligibility.eligibleToBookOnline,
                    isInstructor,
                });
                throw new EligibilityNotEligibleError_1.EligibilityNotEligibleError("Candidate is not eligible to book");
            }
        }
        try {
            candidateEligibility = await this.createOrUpdateCandidate(candidateEligibility, licenceNumber);
        }
        catch (error) {
            if (error instanceof CrmTooManyRequestsError_1.CrmTooManyRequestsError ||
                error instanceof CrmServerError_1.CrmServerError) {
                throw error;
            }
            logger_1.logger.error(error, "CandidateService::createOrUpdateCandidate: Failed to create/update candidate");
            throw new CrmCreateUpdateCandidateError_1.CrmCreateUpdateCandidateError();
        }
        return candidateEligibility;
    }
    async getLicenceNumberRecordsByCandidateId(candidateId, licenceNumber) {
        try {
            const response = await this.crmGateway.getLicenceNumberRecordsByCandidateId(candidateId, licenceNumber);
            return response;
        }
        catch (error) {
            throw new CrmRetrieveLicenceError_1.CrmRetrieveLicenceError();
        }
    }
    async alignCandidateDataInCRM(candidate, licenceNumber) {
        let crmCandidate = await this.crmGateway.getLicenceNumberRecordsByCandidateId(candidate.candidateId, licenceNumber);
        let licenceId = crmCandidate === null || crmCandidate === void 0 ? void 0 : crmCandidate.licenceId;
        if (crmCandidate) {
            // Candidate already exists, check if licence and candidate updates are required and update them
            if (this.isLicenceDataToBeUpdated(candidate, crmCandidate)) {
                logger_1.logger.info("CandidateService::alignCandidateDataInCRM: licence has to be updated");
                await this.crmGateway.updateLicence(crmCandidate === null || crmCandidate === void 0 ? void 0 : crmCandidate.licenceId, candidate.candidateId, candidate.address);
                // candidate entity has duplicated address fields, the same as licence entity, so if addres changed we have to update both
                crmCandidate = await this.crmGateway.updateCandidate(candidate.candidateId, candidate);
            }
            if (this.isCandidateDataToBeUpdated(candidate, crmCandidate)) {
                logger_1.logger.info("CandidateService::alignCandidateDataInCRM: candidate has to be updated");
                crmCandidate = await this.crmGateway.updateCandidate(candidate.candidateId, candidate);
            }
        }
        else {
            // Create new licence and update candidate
            logger_1.logger.info("CandidateService::alignCandidateDataInCRM: crmCandidate undefined, new licence will be created");
            licenceId = await this.crmGateway.createLicence(licenceNumber, candidate.address, candidate.candidateId);
            crmCandidate = await this.crmGateway.updateCandidate(candidate.candidateId, candidate);
        }
        return {
            licenceId,
            crmCandidate,
        };
    }
    doesCandidateMatchEligibility(candidateDetails, candidateEligibility, target, locale, isInstructorJourney) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const firstnames = this.replaceFirstnameWithThreeDashesIfEmptyGB(target, candidateDetails.firstnames);
        const firstnamesValid = ((_a = firstnames.toUpperCase()) === null || _a === void 0 ? void 0 : _a.trim()) ===
            ((_b = candidateEligibility.firstnames) === null || _b === void 0 ? void 0 : _b.toUpperCase().trim());
        const surnameValid = ((_d = (_c = candidateDetails.surname) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === null || _d === void 0 ? void 0 : _d.trim()) ===
            ((_e = candidateEligibility.surname) === null || _e === void 0 ? void 0 : _e.toUpperCase().trim());
        const dobValid = dayjs_1.default(`${(_f = candidateDetails.dobYear) === null || _f === void 0 ? void 0 : _f.trim()}-${(_g = candidateDetails.dobMonth) === null || _g === void 0 ? void 0 : _g.trim()}-${(_h = candidateDetails.dobDay) === null || _h === void 0 ? void 0 : _h.trim()}`).format("YYYY-MM-DD") === (candidateEligibility === null || candidateEligibility === void 0 ? void 0 : candidateEligibility.dateOfBirth);
        // validates PRN if from instructor journey, otherwise defaults to true for candidate service
        const prnValid = isInstructorJourney
            ? this.doesPRNMatchEligibility(candidateDetails
                .personalReference, candidateEligibility, target)
            : true;
        const errors = [];
        if (!firstnamesValid) {
            logger_1.logger.debug("CandidateService::doesCandidateMatchEligibility: First name did not match eligibility response", {
                target,
                locale,
                firstnamesLength: candidateDetails.firstnames.trim().length,
            });
            const error = new Error("First name did not match eligibility response");
            errors.push(error);
        }
        if (!surnameValid) {
            logger_1.logger.debug("CandidateService::doesCandidateMatchEligibility: Surname did not match eligibility response", {
                target,
                locale,
                surnameLength: candidateDetails.surname.trim().length,
            });
            const error = new Error("Surname did not match eligibility response");
            errors.push(error);
        }
        if (!dobValid) {
            const error = new Error("Date of birth did not match eligibility response");
            errors.push(error);
        }
        if (!prnValid) {
            const error = new Error("Instructor PRN did not match eligibility response");
            errors.push(error);
        }
        if (errors.length > 0) {
            throw new MultipleCandidateMatchError_1.MultipleCandidateMismatchError(errors);
        }
        return firstnamesValid && surnameValid && dobValid && prnValid;
    }
    doesPRNMatchEligibility(prn, candidateEligibility, target) {
        var _a;
        const prnMatches = ((_a = candidateEligibility.eligibilities) === null || _a === void 0 ? void 0 : _a.filter((eligibility) => (eligibility === null || eligibility === void 0 ? void 0 : eligibility.eligible) === true).map((eligibility) => {
            var _a, _b;
            if (target === enums_1.Target.NI) {
                return ((_a = eligibility === null || eligibility === void 0 ? void 0 : eligibility.paymentReceiptNumber) === null || _a === void 0 ? void 0 : _a.trim()) === prn;
            }
            return ((_b = eligibility === null || eligibility === void 0 ? void 0 : eligibility.personalReferenceNumber) === null || _b === void 0 ? void 0 : _b.trim()) === prn;
        }).filter((match) => match)) || [];
        return prnMatches.length > 0;
    }
    async createOrUpdateCandidate(candidateEligibility, licenceNumber) {
        const { candidateId } = candidateEligibility;
        if (candidateId) {
            // Candidate exists in CRM.
            try {
                const alignCandidateResponse = await this.alignCandidateDataInCRM(candidateEligibility, licenceNumber);
                return {
                    ...candidateEligibility,
                    licenceId: alignCandidateResponse === null || alignCandidateResponse === void 0 ? void 0 : alignCandidateResponse.licenceId,
                };
            }
            catch (error) {
                logger_1.logger.error(error, "CandidateService::createOrUpdateCandidate: Failed to update candidate from Eligibility into CRM", { candidateId });
                if ((error === null || error === void 0 ? void 0 : error.status) === 429) {
                    throw new CrmTooManyRequestsError_1.CrmTooManyRequestsError();
                }
                if ((error === null || error === void 0 ? void 0 : error.status) >= 500 && (error === null || error === void 0 ? void 0 : error.status) < 600) {
                    throw new CrmServerError_1.CrmServerError(`${error === null || error === void 0 ? void 0 : error.status}`);
                }
                throw error;
            }
        }
        else {
            // Candidate doesn't exist in CRM.
            try {
                if (!candidateEligibility.address) {
                    throw new Error("CandidateService::createOrUpdateCandidate: Missing Address from Eligibility Response");
                }
                const crmCandidateId = await this.crmGateway.createCandidate(candidateEligibility);
                const crmLicenceId = await this.crmGateway.createLicence(licenceNumber, candidateEligibility.address, crmCandidateId);
                return {
                    ...candidateEligibility,
                    candidateId: crmCandidateId,
                    licenceId: crmLicenceId,
                };
            }
            catch (error) {
                logger_1.logger.error(error, "CandidateService::createOrUpdateCandidate: Failed to create candidate and licence from Eligibility into CRM");
                if ((error === null || error === void 0 ? void 0 : error.status) === 429) {
                    throw new CrmTooManyRequestsError_1.CrmTooManyRequestsError();
                }
                if ((error === null || error === void 0 ? void 0 : error.status) >= 500 && (error === null || error === void 0 ? void 0 : error.status) < 600) {
                    throw new CrmServerError_1.CrmServerError(`${error === null || error === void 0 ? void 0 : error.status}`);
                }
                throw error;
            }
        }
    }
    isLicenceDataToBeUpdated(candidateEligibility, crmCandidate) {
        const eligibilityAddress = crm_address_mapper_1.mapToCrmContactAddress(candidateEligibility.address);
        const crmAddress = crm_address_mapper_1.mapToCrmContactAddress(crmCandidate.address);
        return (sanitisation_1.convertNullUndefinedToEmptyString(eligibilityAddress.address1_line1) !==
            sanitisation_1.convertNullUndefinedToEmptyString(crmAddress.address1_line1) ||
            sanitisation_1.convertNullUndefinedToEmptyString(eligibilityAddress.address1_line2) !==
                sanitisation_1.convertNullUndefinedToEmptyString(crmAddress.address1_line2) ||
            sanitisation_1.convertNullUndefinedToEmptyString(eligibilityAddress.address1_city) !==
                sanitisation_1.convertNullUndefinedToEmptyString(crmAddress.address1_city) ||
            sanitisation_1.convertNullUndefinedToEmptyString(eligibilityAddress.address1_postalcode) !== sanitisation_1.convertNullUndefinedToEmptyString(crmAddress.address1_postalcode));
    }
    isCandidateDataToBeUpdated(candidateEligibility, crmCandidate) {
        var _a, _b;
        return (sanitisation_1.convertNullUndefinedToEmptyString(candidateEligibility.firstnames) !==
            sanitisation_1.convertNullUndefinedToEmptyString(crmCandidate.firstnames) ||
            sanitisation_1.convertNullUndefinedToEmptyString(candidateEligibility.surname) !==
                sanitisation_1.convertNullUndefinedToEmptyString(crmCandidate.surname) ||
            sanitisation_1.convertNullUndefinedToEmptyString(candidateEligibility.dateOfBirth) !==
                sanitisation_1.convertNullUndefinedToEmptyString(crmCandidate.dateOfBirth) ||
            sanitisation_1.convertNullUndefinedToEmptyString((_a = candidateEligibility.title) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !==
                sanitisation_1.convertNullUndefinedToEmptyString((_b = crmCandidate.title) === null || _b === void 0 ? void 0 : _b.toLowerCase()) ||
            candidateEligibility.gender !== crmCandidate.gender);
    }
    replaceFirstnameWithThreeDashesIfEmptyGB(target, firstname) {
        return (firstname.trim() === "" || firstname.trim() === "-") &&
            target === enums_1.Target.GB
            ? "---"
            : firstname;
    }
}
exports.CandidateService = CandidateService;
CandidateService.isDrivingLicenceValid = (licenceNumber, meta) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (licenceNumber.trim() === "") {
        throw new Error("Driving Licence Number is empty");
    }
    try {
        return licence_number_1.LicenceNumber.isValid(licenceNumber, meta);
    }
    catch (error) {
        logger_1.logger.debug("CandidateService::isDrivingLicenceValid: Driving Licence Number is invalid", {
            message: (_a = error) === null || _a === void 0 ? void 0 : _a.message,
            licenceNumberLength: licenceNumber.length,
            target: ((_d = (_c = (_b = meta.req) === null || _b === void 0 ? void 0 : _b.res) === null || _c === void 0 ? void 0 : _c.locals) === null || _d === void 0 ? void 0 : _d.target) || enums_1.Target.GB,
            locale: ((_g = (_f = (_e = meta.req) === null || _e === void 0 ? void 0 : _e.res) === null || _f === void 0 ? void 0 : _f.locals) === null || _g === void 0 ? void 0 : _g.locale) || enums_1.Locale.GB,
        });
        throw new Error("Driving Licence Number is invalid");
    }
};
CandidateService.checkAgencyMatchesTarget = (agency, target) => {
    if (!((target === enums_1.Target.NI && agency === enums_2.CRMGovernmentAgency.Dva) ||
        (target === enums_1.Target.GB && agency === enums_2.CRMGovernmentAgency.Dvsa))) {
        throw new AgencyMismatchError_1.AgencyMismatchError();
    }
};
