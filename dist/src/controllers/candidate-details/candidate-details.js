"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateDetailsController = void 0;
const date_of_birth_1 = require("../../domain/date-of-birth");
const enums_1 = require("../../domain/enums");
const CrmCreateUpdateCandidateError_1 = require("../../domain/errors/crm/CrmCreateUpdateCandidateError");
const CrmRetrieveLicenceError_1 = require("../../domain/errors/crm/CrmRetrieveLicenceError");
const CrmServerError_1 = require("../../domain/errors/crm/CrmServerError");
const CrmTooManyRequestsError_1 = require("../../domain/errors/crm/CrmTooManyRequestsError");
const EligibilityAuthError_1 = require("../../domain/errors/eligibility/EligibilityAuthError");
const EligibilityLicenceNotFoundError_1 = require("../../domain/errors/eligibility/EligibilityLicenceNotFoundError");
const EligibilityNotEligibleError_1 = require("../../domain/errors/eligibility/EligibilityNotEligibleError");
const EligibilityNotLatestLicenceError_1 = require("../../domain/errors/eligibility/EligibilityNotLatestLicenceError");
const EligibilityRetrieveError_1 = require("../../domain/errors/eligibility/EligibilityRetrieveError");
const EligibilityServerError_1 = require("../../domain/errors/eligibility/EligibilityServerError");
const EligibilityTooManyRequestsError_1 = require("../../domain/errors/eligibility/EligibilityTooManyRequestsError");
const MultipleCandidateMatchError_1 = require("../../domain/errors/MultipleCandidateMatchError");
const licence_number_1 = require("../../domain/licence-number");
const language_1 = require("../../helpers/language");
const logger_1 = require("../../helpers/logger");
const candidate_service_1 = require("../../services/candidates/candidate-service");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const eligibility_gateway_1 = require("../../services/eligibility/eligibility-gateway");
const session_1 = require("../../services/session");
class CandidateDetailsController {
    constructor(candidateService) {
        this.candidateService = candidateService;
        this.get = (req, res) => {
            var _a, _b, _c;
            if ((_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.testType) {
                session_1.store.reset(req, res);
                return res.redirect("/");
            }
            let details = {};
            if (typeof ((_b = req.query) === null || _b === void 0 ? void 0 : _b.licenceNum) === "string") {
                const licenceNumber = licence_number_1.LicenceNumber.of(req.query.licenceNum, req.session.target || enums_1.Target.GB);
                details = {
                    licenceNumber: licenceNumber.toString(),
                };
            }
            return res.render("common/candidate-details", {
                details,
                support: (_c = req.session.journey) === null || _c === void 0 ? void 0 : _c.support,
            });
        };
        this.post = async (req, res) => {
            if (req.hasErrors) {
                req.errors.forEach((error) => {
                    const errorMessage = error.msg;
                    if (errorMessage) {
                        logger_1.logger.warn(`CandidateDetailsController::post: ${errorMessage}`, {
                            target: req.session.target,
                            locale: req.session.locale,
                        });
                    }
                });
                return this.sendIncorrectDetailsErrorResponse(req, res);
            }
            if (!req.session.journey) {
                throw Error("CandidateDetailsController::post: No journey set");
            }
            const candidateDetails = req.body;
            const licenceNumber = this.getLicenceNumber(candidateDetails, req);
            try {
                const candidateEligibility = await this.candidateService.getEligibility(licenceNumber, candidateDetails, req.session.target, req.session.locale, false);
                const crmCandidate = await this.candidateService.getLicenceNumberRecordsByCandidateId(candidateEligibility.candidateId, licenceNumber);
                const personReference = crmCandidate === null || crmCandidate === void 0 ? void 0 : crmCandidate.personReference;
                req.session.candidate = {
                    ...req.session.candidate,
                    ...candidateEligibility,
                    licenceNumber,
                    personReference,
                    supportNeedName: crmCandidate === null || crmCandidate === void 0 ? void 0 : crmCandidate.supportNeedName,
                    supportEvidenceStatus: crmCandidate === null || crmCandidate === void 0 ? void 0 : crmCandidate.supportEvidenceStatus,
                };
                req.session.currentBooking = {
                    ...req.session.currentBooking,
                    bsl: false,
                    voiceover: enums_1.Voiceover.NONE,
                };
                const { support } = req.session.journey;
                if (support) {
                    return res.redirect("test-type");
                }
                return res.redirect("email-contact");
            }
            catch (error) {
                if (error instanceof EligibilityTooManyRequestsError_1.EligibilityTooManyRequestsError ||
                    error instanceof EligibilityServerError_1.EligibilityServerError ||
                    error instanceof CrmTooManyRequestsError_1.CrmTooManyRequestsError ||
                    error instanceof CrmServerError_1.CrmServerError) {
                    return res.render("eligibility-retry");
                }
                if (error instanceof EligibilityNotEligibleError_1.EligibilityNotEligibleError) {
                    logger_1.logger.warn(`CandidateDetailsController::post: Not eligible - ${error.message}`, {
                        target: req.session.target,
                        locale: req.session.locale,
                    });
                    return res.render("no-eligibility");
                }
                if (error instanceof CrmCreateUpdateCandidateError_1.CrmCreateUpdateCandidateError ||
                    error instanceof CrmRetrieveLicenceError_1.CrmRetrieveLicenceError ||
                    error instanceof EligibilityAuthError_1.EligibilityAuthError) {
                    throw error;
                }
                if (error instanceof EligibilityLicenceNotFoundError_1.EligibilityLicenceNotFoundError ||
                    error instanceof EligibilityNotLatestLicenceError_1.EligibilityNotLatestLicenceError ||
                    error instanceof EligibilityRetrieveError_1.EligibilityRetrieveError) {
                    logger_1.logger.warn(`CandidateDetailsController::post: ${error.message}`, {
                        target: req.session.target,
                        locale: req.session.locale,
                    });
                    return this.sendIncorrectDetailsErrorResponse(req, res);
                }
                if (error instanceof MultipleCandidateMatchError_1.MultipleCandidateMismatchError) {
                    const { errors } = error;
                    errors === null || errors === void 0 ? void 0 : errors.forEach((fieldError) => {
                        logger_1.logger.warn(`CandidateDetailsController::post: ${fieldError.message}`, {
                            target: req.session.target,
                            locale: req.session.locale,
                        });
                    });
                    return this.sendIncorrectDetailsErrorResponse(req, res);
                }
                throw error;
            }
        };
        this.sendIncorrectDetailsErrorResponse = (req, res) => {
            var _a;
            logger_1.logger.event(logger_1.BusinessTelemetryEvents.ELIGIBILITY_REQUEST_ISSUE, "CandidateDetailsController::sendIncorrectDetailsErrorResponse: Eligibility request error", {
                error: req.errors,
            });
            // Errors are overwritten to not provide a clue as to which field contains the error for security reasons
            req.errors = [
                {
                    location: "body",
                    msg: language_1.translate("details.errorMessage"),
                    param: "",
                },
            ];
            return res.render("common/candidate-details", {
                details: req.body,
                errors: req.errors,
                support: (_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.support,
            });
        };
        /* istanbul ignore next */
        this.postSchemaValidation = {
            firstnames: {
                in: ["body"],
                trim: true,
            },
            surname: {
                in: ["body"],
                trim: true,
                isEmpty: {
                    negated: true,
                },
                errorMessage: "Surname is empty",
            },
            licenceNumber: {
                in: ["body"],
                trim: true,
                custom: {
                    options: candidate_service_1.CandidateService.isDrivingLicenceValid,
                },
            },
            dobDay: {
                in: ["body"],
                custom: {
                    options: date_of_birth_1.DateOfBirth.isValid,
                },
            },
        };
    }
    getLicenceNumber(candidateDetails, req) {
        var _a;
        return (_a = licence_number_1.LicenceNumber.of(candidateDetails.licenceNumber, req.session.target || enums_1.Target.GB)) === null || _a === void 0 ? void 0 : _a.toString().toUpperCase();
    }
}
exports.CandidateDetailsController = CandidateDetailsController;
exports.default = new CandidateDetailsController(new candidate_service_1.CandidateService(crm_gateway_1.CRMGateway.getInstance(), eligibility_gateway_1.EligibilityGateway.getInstance()));
