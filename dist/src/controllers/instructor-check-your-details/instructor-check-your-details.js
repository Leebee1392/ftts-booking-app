"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorCheckYourDetailsController = void 0;
const enums_1 = require("../../domain/enums");
const notifications_gateway_1 = require("../../services/notifications/notifications-gateway");
const logger_1 = require("../../helpers/logger");
const builders_1 = require("../../services/notifications/content/builders");
const booking_handler_1 = require("../../helpers/booking-handler");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const test_voiceover_1 = require("../../domain/test-voiceover");
const test_language_1 = require("../../domain/test-language");
const CrmCreateBookingDataError_1 = require("../../domain/errors/crm/CrmCreateBookingDataError");
const links_1 = require("../../helpers/links");
const evidence_helper_1 = require("../../helpers/evidence-helper");
const crm_helper_1 = require("../../services/crm-gateway/crm-helper");
class InstructorCheckYourDetailsController {
    constructor(notifications, crmGateway) {
        this.notifications = notifications;
        this.crmGateway = crmGateway;
        this.get = (req, res) => {
            req.session.journey = {
                ...req.session.journey,
                inEditMode: true,
            };
            this.renderPage(req, res);
        };
        this.post = async (req, res) => {
            var _a, _b, _c;
            if (!req.session.currentBooking) {
                throw Error("InstructorCheckYourDetailsController::renderPage: No currentBooking set");
            }
            const target = req.session.target || enums_1.Target.GB;
            const lang = req.session.locale || enums_1.Locale.GB;
            const emailAddress = (_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.email;
            req.session.currentBooking = {
                ...req.session.currentBooking,
                governmentAgency: target,
            };
            req.session.journey = {
                ...req.session.journey,
                inEditMode: false,
            };
            try {
                const handler = new booking_handler_1.BookingHandler(this.crmGateway, req);
                await handler.createBooking();
            }
            catch (error) {
                logger_1.logger.error(error, "InstructorCheckYourDetailsController::post: Error creating booking entity in CRM");
                if (error instanceof CrmCreateBookingDataError_1.CrmCreateBookingDataError) {
                    return res.redirect(links_1.getErrorPageLink("/error-technical", req));
                }
                if (error.status === 429 || (error.status >= 500 && error.status < 600)) {
                    // If we have error codes that relate to a retryable state.
                    // Send them to an error page that allows user to redirect back to retry the request.
                    return res.render("supported/check-details-error");
                }
                throw error; // Throw the error, stopping them from retrying.
            }
            const booking = req.session.currentBooking;
            if (!booking.bookingRef || !booking.testType || !booking.language) {
                logger_1.logger.error(Error("InstructorCheckYourDetailsController::post::Booking details not set correctly"), "Error: Could not send support email", {
                    bookingId: booking.bookingId,
                    bookingRef: booking.bookingRef,
                    testType: booking.testType,
                    language: booking.language,
                });
                return res.redirect("/instructor/booking-confirmation");
            }
            const emailDetails = {
                reference: booking.bookingRef,
                testType: booking.testType,
                testLanguage: booking.language,
                supportTypes: (booking === null || booking === void 0 ? void 0 : booking.selectSupportType) || [],
                voiceover: ((_b = booking === null || booking === void 0 ? void 0 : booking.selectSupportType) === null || _b === void 0 ? void 0 : _b.includes(enums_1.SupportType.VOICEOVER))
                    ? booking === null || booking === void 0 ? void 0 : booking.voiceover
                    : undefined,
                translator: target === enums_1.Target.NI ? booking === null || booking === void 0 ? void 0 : booking.translator : undefined,
                customSupport: ((_c = booking === null || booking === void 0 ? void 0 : booking.selectSupportType) === null || _c === void 0 ? void 0 : _c.includes(enums_1.SupportType.OTHER))
                    ? booking === null || booking === void 0 ? void 0 : booking.customSupport
                    : undefined,
                preferredDay: {
                    option: booking === null || booking === void 0 ? void 0 : booking.preferredDayOption,
                    text: (booking === null || booking === void 0 ? void 0 : booking.preferredDayOption) === enums_1.PreferredDay.ParticularDay
                        ? booking.preferredDay
                        : undefined,
                },
                preferredLocation: {
                    option: booking === null || booking === void 0 ? void 0 : booking.preferredLocationOption,
                    text: (booking === null || booking === void 0 ? void 0 : booking.preferredLocationOption) ===
                        enums_1.PreferredLocation.ParticularLocation
                        ? booking.preferredLocation
                        : undefined,
                },
            };
            const emailContent = this.buildCorrespondingSupportRequestEmailContent(emailDetails, target, lang, req.session.candidate);
            try {
                await this.notifications.sendEmail(emailAddress || "", emailContent, (booking === null || booking === void 0 ? void 0 : booking.bookingRef) || "", target);
            }
            catch (error) {
                logger_1.logger.error(error, "Error: Could not send support request email", {
                    bookingId: booking.bookingId,
                });
            }
            return res.redirect("/instructor/booking-confirmation");
        };
    }
    renderPage(req, res) {
        if (!req.session.currentBooking) {
            throw Error("InstructorCheckYourDetailsController::renderPage: No currentBooking set");
        }
        const { candidate } = req.session;
        const target = req.session.target || enums_1.Target.GB;
        const booking = req.session.currentBooking;
        if (!candidate || !booking || !booking.testType) {
            throw Error("InstructorCheckYourDetailsController::renderPage: Missing required candidate/booking session data");
        }
        const personalDetailsViewData = {
            firstNames: candidate.firstnames,
            surname: candidate.surname,
            dateOfBirth: candidate.dateOfBirth,
            licenceNumber: candidate.licenceNumber,
            telephoneNumber: candidate.telephone,
            voicemail: booking.voicemail,
            emailAddress: candidate.email,
        };
        const testDetailsViewData = {
            testType: booking.testType,
            testLanguage: booking.language,
            canChangeTestLanguage: test_language_1.TestLanguage.canChangeTestLanguage(req.session.target || enums_1.Target.GB, booking.testType),
        };
        const supportTypes = booking.selectSupportType || [];
        const supportDetailsViewData = {
            supportTypes,
            showVoiceoverRow: supportTypes.includes(enums_1.SupportType.VOICEOVER),
            voiceover: booking.voiceover === enums_1.Voiceover.NONE ? undefined : booking.voiceover,
            canChangeVoiceover: test_voiceover_1.TestVoiceover.availableOptions(target, booking.testType).length > 1,
            showTranslatorRow: supportTypes.includes(enums_1.SupportType.TRANSLATOR),
            translator: booking.translator || undefined,
            showCustomSupportRow: supportTypes.includes(enums_1.SupportType.OTHER),
            customSupport: booking.customSupport,
            preferredDayOption: booking.preferredDayOption,
            preferredDay: booking.preferredDayOption === enums_1.PreferredDay.ParticularDay
                ? booking.preferredDay
                : undefined,
            preferredLocationOption: booking.preferredLocationOption,
            preferredLocation: booking.preferredLocationOption === enums_1.PreferredLocation.ParticularLocation
                ? booking.preferredLocation
                : undefined,
        };
        return res.render("instructor/check-your-details", {
            ...personalDetailsViewData,
            ...testDetailsViewData,
            ...supportDetailsViewData,
            backLink: this.getBackLink(req),
        });
    }
    getBackLink(req) {
        if (!req.session.currentBooking) {
            throw Error("InstructorCheckYourDetailsController::getBackLink: No currentBooking set");
        }
        const { voicemail } = req.session.currentBooking;
        return voicemail !== undefined ? "voicemail" : "telephone-contact";
    }
    buildCorrespondingSupportRequestEmailContent(details, target, lang, candidate) {
        const hasSupportNeedsInCRM = crm_helper_1.hasCRMSupportNeeds(candidate);
        const evidencePath = evidence_helper_1.determineEvidenceRoute(details.supportTypes, hasSupportNeedsInCRM);
        switch (evidencePath) {
            case enums_1.EvidencePath.EVIDENCE_REQUIRED:
                return builders_1.buildEvidenceRequiredEmailContent(details, target, lang);
            case enums_1.EvidencePath.EVIDENCE_NOT_REQUIRED:
                return builders_1.buildEvidenceNotRequiredEmailContent(details, target, lang);
            case enums_1.EvidencePath.EVIDENCE_MAY_BE_REQUIRED:
                return builders_1.buildEvidenceMayBeRequiredEmailContent(details, target, lang);
            case enums_1.EvidencePath.RETURNING_CANDIDATE:
                return builders_1.buildReturningCandidateEmailContent(details, target, lang);
            default:
                throw Error(`CheckYourDetailsController::buildCorrespondingSupportRequestEmailContent: No corresponding email content found for ${evidencePath}`);
        }
    }
}
exports.InstructorCheckYourDetailsController = InstructorCheckYourDetailsController;
exports.default = new InstructorCheckYourDetailsController(notifications_gateway_1.notificationsGateway, crm_gateway_1.CRMGateway.getInstance());
