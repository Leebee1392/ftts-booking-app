"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageBookingLoginController = void 0;
const booking_reference_1 = require("../../domain/booking/booking-reference");
const crm_1 = require("../../domain/errors/crm");
const eligibility_1 = require("../../domain/errors/eligibility");
const login_1 = require("../../domain/errors/login");
const licence_number_1 = require("../../domain/licence-number");
const helpers_1 = require("../../helpers");
const candidate_service_1 = require("../../services/candidates/candidate-service");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const eligibility_gateway_1 = require("../../services/eligibility/eligibility-gateway");
const session_1 = require("../../services/session");
const booking_manager_1 = require("../../helpers/booking-manager");
const errorMessages = {
    fieldsLeftBlank: () => helpers_1.translate("manageBookingLogin.errorMessages.fieldsLeftBlank"),
    incorrectDetails: () => helpers_1.translate("manageBookingLogin.errorMessages.incorrectDetails"),
};
class ManageBookingLoginController {
    constructor(crm, eligibilityGateway, candidateService) {
        this.crm = crm;
        this.eligibilityGateway = eligibilityGateway;
        this.candidateService = candidateService;
        this.get = (req, res) => {
            var _a, _b;
            session_1.store.reset(req);
            if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.journey)) {
                throw new Error("Journey is not set in the session");
            }
            if (!((_b = req.session.journey) === null || _b === void 0 ? void 0 : _b.inManageBookingMode)) {
                req.session.journey.inManageBookingMode = true;
            }
            return res.render("manage-booking/login", {
                backLink: this.getBackLink(req),
            });
        };
        this.post = async (req, res) => {
            var _a;
            if (req.hasErrors) {
                req.errors.forEach((error) => {
                    const errorMessage = error.msg;
                    if (errorMessage) {
                        helpers_1.logger.warn(`ManageBookingLoginController::post: ${errorMessage}`, {
                            target: req.session.target,
                            locale: req.session.locale,
                        });
                    }
                });
                return this.sendErrorResponse(req, res);
            }
            const bookingDetails = req.body;
            const { bookingReference } = bookingDetails;
            const licenceNumber = (_a = licence_number_1.LicenceNumber.of(bookingDetails.licenceNumber, req.session.target)) === null || _a === void 0 ? void 0 : _a.toString().toUpperCase();
            try {
                helpers_1.logger.debug(`ManageBookingLoginController::post: Requesting eligibility for licence number: ${licenceNumber}`, {
                    licenceNumber,
                    bookingRef: bookingReference,
                });
                const candidateEligibility = await this.candidateService.getManageBookingEligibility(licenceNumber, req.session.target, req.session.locale);
                const { candidateId } = candidateEligibility;
                if (!candidateId) {
                    helpers_1.logger.warn("ManageBookingLoginController::post: Candidate record for the given licence number does not exist in CRM", {
                        bookingRef: bookingReference,
                        target: req.session.target,
                        locale: req.session.locale,
                    });
                    return this.sendErrorResponse(req, res);
                }
                const bookingManager = new booking_manager_1.BookingManager(this.crm);
                const bookings = await bookingManager.loadCandidateBookings(req, candidateId);
                const candidateAndBookingRefMatch = bookings === null || bookings === void 0 ? void 0 : bookings.find((booking) => helpers_1.isEqualBookingRefs(booking.reference, bookingReference));
                const target = req.session.target;
                if (!candidateAndBookingRefMatch) {
                    helpers_1.logger.debug("ManageBookingLoginController::post: Booking not found for candidate", {
                        candidateId,
                        bookingRef: bookingReference,
                    });
                    throw new login_1.BookingNotFoundError();
                }
                candidate_service_1.CandidateService.checkAgencyMatchesTarget(candidateAndBookingRefMatch.governmentAgency, target);
                const result = await this.candidateService.alignCandidateDataInCRM(candidateEligibility, licenceNumber);
                const candidate = result === null || result === void 0 ? void 0 : result.crmCandidate;
                const licenceId = result === null || result === void 0 ? void 0 : result.licenceId;
                req.session.manageBooking = {
                    ...req.session.manageBooking,
                    candidate: {
                        ...candidateEligibility,
                        personReference: candidate === null || candidate === void 0 ? void 0 : candidate.personReference,
                        email: candidate === null || candidate === void 0 ? void 0 : candidate.email,
                        telephone: candidate === null || candidate === void 0 ? void 0 : candidate.telephone,
                        licenceId,
                        licenceNumber,
                    },
                };
                return res.redirect("home");
            }
            catch (error) {
                if (error instanceof eligibility_1.EligibilityLicenceNotFoundError ||
                    error instanceof eligibility_1.EligibilityNotLatestLicenceError ||
                    error instanceof eligibility_1.EligibilityRetrieveError ||
                    error instanceof login_1.AgencyMismatchError ||
                    error instanceof login_1.BookingNotFoundError) {
                    helpers_1.logger.warn(`ManageBookingLoginController::post: ${error.message}`, {
                        target: req.session.target,
                        locale: req.session.locale,
                    });
                    return this.sendErrorResponse(req, res);
                }
                helpers_1.logger.error(error, "ManageBookingLoginController::post: Failed login attempt", {
                    bookingRef: bookingReference,
                    target: req.session.target,
                    locale: req.session.locale,
                });
                // Show Generic error page
                if (error instanceof eligibility_1.EligibilityAuthError ||
                    error instanceof crm_1.CrmRetrieveLicenceError ||
                    error instanceof crm_1.CrmCreateUpdateCandidateError) {
                    throw error;
                }
                if (error instanceof eligibility_1.EligibilityTooManyRequestsError ||
                    error instanceof eligibility_1.EligibilityServerError ||
                    error instanceof crm_1.CrmTooManyRequestsError ||
                    error instanceof crm_1.CrmServerError) {
                    return res.render("manage-booking/error-eligibility-retry");
                }
                throw error;
            }
        };
        this.sendErrorResponse = (req, res) => {
            var _a;
            const errorMessage = ((_a = req.errors[0]) === null || _a === void 0 ? void 0 : _a.msg) === "fieldsLeftBlank" ||
                this.hasEmptyFields(req.errors)
                ? errorMessages.fieldsLeftBlank()
                : errorMessages.incorrectDetails();
            req.errors = [
                {
                    location: "body",
                    msg: errorMessage,
                    param: "",
                },
            ];
            return res.status(400).render("manage-booking/login", {
                errors: req.errors,
                ...req.body,
                backLink: this.getBackLink(req),
            });
        };
        this.hasEmptyFields = (errors) => {
            if (!errors) {
                return false;
            }
            // eslint-disable-next-line no-restricted-syntax
            for (const error of errors) {
                if ((error === null || error === void 0 ? void 0 : error.msg) === booking_reference_1.emptyBookingReferenceErrorMsg ||
                    (error === null || error === void 0 ? void 0 : error.msg) === "Driving Licence Number is empty") {
                    return true;
                }
            }
            return false;
        };
        this.getBackLink = (req) => helpers_1.getManageBookingLinkToStartPage(req);
        /* istanbul ignore next */
        this.postSchemaValidation = {
            bookingReference: {
                in: ["body"],
                trim: true,
                custom: {
                    options: booking_reference_1.BookingReference.isValid,
                },
            },
            licenceNumber: {
                in: ["body"],
                trim: true,
                custom: {
                    options: candidate_service_1.CandidateService.isDrivingLicenceValid,
                },
            },
        };
    }
}
exports.ManageBookingLoginController = ManageBookingLoginController;
exports.default = new ManageBookingLoginController(crm_gateway_1.CRMGateway.getInstance(), eligibility_gateway_1.EligibilityGateway.getInstance(), new candidate_service_1.CandidateService(crm_gateway_1.CRMGateway.getInstance(), eligibility_gateway_1.EligibilityGateway.getInstance()));
