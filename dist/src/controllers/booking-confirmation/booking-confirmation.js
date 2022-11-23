"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingConfirmation = void 0;
const enums_1 = require("../../domain/enums");
const bsl_1 = require("../../domain/bsl");
const test_language_1 = require("../../domain/test-language");
const journey_helper_1 = require("../../helpers/journey-helper");
const language_1 = require("../../helpers/language");
const evidence_helper_1 = require("../../helpers/evidence-helper");
const session_1 = require("../../services/session");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const session_helper_1 = require("../../helpers/session-helper");
const crm_helper_1 = require("../../services/crm-gateway/crm-helper");
const config_1 = __importDefault(require("../../config"));
class BookingConfirmation {
    constructor(crm) {
        this.crm = crm;
        this.get = (req, res) => {
            if (!req.session.currentBooking) {
                throw Error("BookingConfirmation::get: No currentBooking set");
            }
            if (!session_helper_1.isCandidateSet(req)) {
                throw Error("BookingConfirmation::get: No candidate set");
            }
            const { bookingRef, dateTime, centre, testType, lastRefundDate, language, bsl, voiceover, selectSupportType, preferredDay, preferredDayOption, preferredLocation, preferredLocationOption, } = req.session.currentBooking;
            const { digitalResultsEmailInfo } = config_1.default.featureToggles;
            const inSupportMode = journey_helper_1.isNonStandardJourney(req);
            const selectedSupportOptions = inSupportMode
                ? this.getSelectedSupportOptions(req)
                : [];
            const hasSupportNeedsInCRM = inSupportMode
                ? crm_helper_1.hasCRMSupportNeeds(req.session.candidate)
                : false;
            const typeOfEvidenceRequired = inSupportMode
                ? evidence_helper_1.determineEvidenceRoute(selectedSupportOptions, hasSupportNeedsInCRM)
                : undefined;
            session_1.store.reset(req, res);
            if (inSupportMode) {
                const preferDay = preferredDayOption === enums_1.PreferredDay.DecideLater
                    ? language_1.translate("bookingConfirmation.nonStandardAccommodation.iWillDecideThisLater")
                    : preferredDay;
                const preferLocation = preferredLocationOption === enums_1.PreferredLocation.DecideLater
                    ? language_1.translate("bookingConfirmation.nonStandardAccommodation.iWillDecideThisLater")
                    : preferredLocation;
                return res.render(this.getEvidenceViewPath(typeOfEvidenceRequired), {
                    bookingRef,
                    inSupportMode,
                    testType: language_1.translate(`generalContent.testTypes.${testType}`),
                    language: test_language_1.TestLanguage.from(language).toString(),
                    supportTypes: selectSupportType,
                    preferDay,
                    preferLocation,
                    deafCandidate: evidence_helper_1.isDeafCandidate(selectSupportType),
                });
            }
            return res.render("create/booking-confirmation", {
                centre,
                bookingRef,
                testType,
                dateTime,
                latestRefundDate: lastRefundDate,
                language: test_language_1.TestLanguage.from(language).toString(),
                bslAvailable: bsl_1.bslIsAvailable(testType),
                bsl: bsl
                    ? language_1.translate("generalContent.yes")
                    : language_1.translate("generalContent.no"),
                voiceover: voiceover === enums_1.Voiceover.NONE ? enums_1.YesNo.NO : voiceover,
                inSupportMode,
                digitalResultsEmailInfo, // DIGITAL_RESULTS_EMAIL_INFO feature flag
            });
        };
    }
    getSelectedSupportOptions(req) {
        var _a;
        try {
            const supportTypes = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.selectSupportType;
            if (Array.isArray(supportTypes) && supportTypes.length > 0) {
                return supportTypes;
            }
            throw Error();
        }
        catch (error) {
            throw new Error("BookingConfirmation::getSelectedSupportOptions: No support options provided");
        }
    }
    getEvidenceViewPath(typeOfEvidenceRequired) {
        if (typeOfEvidenceRequired === enums_1.EvidencePath.EVIDENCE_REQUIRED) {
            return "supported/booking-confirmation/booking-confirmation-evidence-required";
        }
        if (typeOfEvidenceRequired === enums_1.EvidencePath.EVIDENCE_NOT_REQUIRED) {
            return "supported/booking-confirmation/booking-confirmation-evidence-not-required";
        }
        if (typeOfEvidenceRequired === enums_1.EvidencePath.EVIDENCE_MAY_BE_REQUIRED) {
            return "supported/booking-confirmation/booking-confirmation-evidence-maybe-required";
        }
        return "supported/booking-confirmation/booking-confirmation-returning-candidate";
    }
}
exports.BookingConfirmation = BookingConfirmation;
exports.default = new BookingConfirmation(crm_gateway_1.CRMGateway.getInstance());
