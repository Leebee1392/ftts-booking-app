"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorCheckYourAnswersController = void 0;
const bsl_1 = require("../../domain/bsl");
const eligibility_1 = require("../../domain/eligibility");
const test_language_1 = require("../../domain/test-language");
const enums_1 = require("../../domain/enums");
const logger_1 = require("../../helpers/logger");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const scheduling_gateway_1 = require("../../services/scheduling/scheduling-gateway");
const booking_handler_1 = require("../../helpers/booking-handler");
const language_1 = require("../../helpers/language");
const CrmCreateBookingDataError_1 = require("../../domain/errors/crm/CrmCreateBookingDataError");
const links_1 = require("../../helpers/links");
const config_1 = __importDefault(require("../../config"));
class InstructorCheckYourAnswersController {
    constructor(scheduling, crmGateway) {
        this.scheduling = scheduling;
        this.crmGateway = crmGateway;
        this.get = (req, res) => {
            req.session.journey = {
                ...req.session.journey,
                inEditMode: true,
                standardAccommodation: true,
            };
            this.renderPage(req, res);
        };
        this.post = async (req, res) => {
            var _a, _b;
            const { target } = req.session;
            req.session.journey = {
                ...req.session.journey,
                inEditMode: false,
            };
            req.session.currentBooking = {
                ...req.session.currentBooking,
                governmentAgency: target,
            };
            if (!req.session.currentBooking.testType) {
                throw new Error("InstructorCheckYourAnswersController::post: Missing test type");
            }
            if (config_1.default.featureToggles.enableExistingBookingValidation) {
                const hasExistingBooking = await this.crmGateway.doesCandidateHaveExistingBookingsByTestType((_a = req.session.candidate) === null || _a === void 0 ? void 0 : _a.candidateId, (_b = req.session.currentBooking) === null || _b === void 0 ? void 0 : _b.testType);
                if (hasExistingBooking) {
                    req.session.lastPage = "/instructor/check-your-answers";
                    return res.redirect("booking-exists");
                }
            }
            try {
                const handler = new booking_handler_1.BookingHandler(this.crmGateway, req, this.scheduling);
                await handler.createBooking();
            }
            catch (error) {
                if (error instanceof scheduling_gateway_1.SlotUnavailableError) {
                    logger_1.logger.warn("InstructorCheckYourAnswersController::post: Slot is unavailable - cannot reserve slot");
                    return res.render("error-slot-unavailable");
                }
                if (error instanceof CrmCreateBookingDataError_1.CrmCreateBookingDataError) {
                    return res.redirect(links_1.getErrorPageLink("/error-technical", req));
                }
                logger_1.logger.error(error, "InstructorCheckYourAnswersController::post: Error creating booking entity in CRM");
                throw error;
            }
            if (req.session.currentBooking.compensationBooking) {
                return res.redirect("payment-confirmation");
            }
            if (eligibility_1.isZeroCostTest(req.session.currentBooking.testType)) {
                return res.redirect("payment-confirmation");
            }
            return res.redirect("payment-initiation");
        };
    }
    renderPage(req, res) {
        var _a, _b, _c, _d, _e;
        const centre = (_a = req.session.editedLocationTime) === null || _a === void 0 ? void 0 : _a.centre;
        const dateTime = (_b = req.session.editedLocationTime) === null || _b === void 0 ? void 0 : _b.dateTime;
        const updatedLocationTime = {};
        if (dateTime) {
            updatedLocationTime.dateTime = dateTime;
            if (centre) {
                updatedLocationTime.centre = centre;
            }
            req.session.currentBooking = {
                ...req.session.currentBooking,
                ...updatedLocationTime,
            };
        }
        req.session.editedLocationTime = undefined;
        const booking = req.session.currentBooking;
        const testLanguage = test_language_1.TestLanguage.from((booking === null || booking === void 0 ? void 0 : booking.language) || "").toString();
        const voiceover = (_c = booking === null || booking === void 0 ? void 0 : booking.voiceover) !== null && _c !== void 0 ? _c : enums_1.Voiceover.NONE;
        const { candidate } = req.session;
        const isCompensationBooking = !!(booking === null || booking === void 0 ? void 0 : booking.compensationBooking);
        return res.render("instructor/check-your-answers", {
            firstNames: candidate === null || candidate === void 0 ? void 0 : candidate.firstnames,
            surname: candidate === null || candidate === void 0 ? void 0 : candidate.surname,
            dateOfBirth: candidate === null || candidate === void 0 ? void 0 : candidate.dateOfBirth,
            licenceNumber: candidate === null || candidate === void 0 ? void 0 : candidate.licenceNumber,
            emailAddress: candidate === null || candidate === void 0 ? void 0 : candidate.email,
            testLanguage,
            price: isCompensationBooking
                ? (_d = booking === null || booking === void 0 ? void 0 : booking.compensationBooking) === null || _d === void 0 ? void 0 : _d.price
                : (_e = booking === null || booking === void 0 ? void 0 : booking.priceList) === null || _e === void 0 ? void 0 : _e.price,
            isCompensationBooking: !!(booking === null || booking === void 0 ? void 0 : booking.compensationBooking),
            dateTime: booking === null || booking === void 0 ? void 0 : booking.dateTime,
            testCentre: booking === null || booking === void 0 ? void 0 : booking.centre,
            testType: booking === null || booking === void 0 ? void 0 : booking.testType,
            supportRequested: this.getYesNoLabel(false),
            bslAvailable: bsl_1.bslIsAvailable(booking === null || booking === void 0 ? void 0 : booking.testType),
            canChangeTestLanguage: test_language_1.TestLanguage.canChangeTestLanguage(req.session.target || enums_1.Target.GB, booking === null || booking === void 0 ? void 0 : booking.testType),
            bsl: this.getYesNoLabel((booking === null || booking === void 0 ? void 0 : booking.bsl) || false),
            voiceover: voiceover === enums_1.Voiceover.NONE
                ? this.getYesNoLabel(false)
                : booking === null || booking === void 0 ? void 0 : booking.voiceover,
            bookingRequiresPayment: !eligibility_1.isZeroCostTest(booking === null || booking === void 0 ? void 0 : booking.testType),
            canChooseSupport: req.session.target !== enums_1.Target.NI,
            isZeroCostBooking: eligibility_1.isZeroCostTest(booking === null || booking === void 0 ? void 0 : booking.testType),
            errors: req.errors,
        });
    }
    getYesNoLabel(value) {
        return value
            ? language_1.translate("generalContent.yes")
            : language_1.translate("generalContent.no");
    }
}
exports.InstructorCheckYourAnswersController = InstructorCheckYourAnswersController;
exports.default = new InstructorCheckYourAnswersController(scheduling_gateway_1.SchedulingGateway.getInstance(), crm_gateway_1.CRMGateway.getInstance());
