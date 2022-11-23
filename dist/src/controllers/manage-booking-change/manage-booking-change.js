"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageBookingChangeController = void 0;
const enums_1 = require("../../domain/enums");
const bsl_1 = require("../../domain/bsl");
const test_language_1 = require("../../domain/test-language");
const test_voiceover_1 = require("../../domain/test-voiceover");
const logger_1 = require("../../helpers/logger");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const enums_2 = require("../../services/crm-gateway/enums");
const maps_1 = require("../../services/crm-gateway/maps");
const session_1 = require("../../services/session");
const manage_booking_handler_1 = require("../../helpers/manage-booking-handler");
const support_1 = require("../../helpers/support");
const eligibility_1 = require("../../domain/eligibility");
const crm_helper_1 = require("../../services/crm-gateway/crm-helper");
class ManageBookingChangeController {
    constructor(crm) {
        this.crm = crm;
        this.get = async (req, res) => {
            var _a, _b;
            if (!req.session.manageBooking) {
                throw Error("ManageBookingChangeController::get: No manageBooking set");
            }
            const { candidate } = req.session.manageBooking;
            const bookingReference = req.params.ref;
            let booking = session_1.store.manageBooking.getBooking(req, bookingReference);
            if (!candidate || !booking || !booking.isViewable()) {
                return res.redirect("login");
            }
            manage_booking_handler_1.setManageBookingEditMode(req);
            req.session.manageBookingEdits = undefined;
            const voiceover = test_voiceover_1.TestVoiceover.fromCRMVoiceover(booking.details.voiceoverLanguage);
            const voiceoverRequested = voiceover !== enums_1.Voiceover.NONE;
            const bslRequested = booking.details.additionalSupport ===
                enums_2.CRMAdditionalSupport.BritishSignLanguage;
            let testLanguage = null;
            try {
                testLanguage = test_language_1.TestLanguage.fromCRMTestLanguage(booking.details.testLanguage);
            }
            catch (error) {
                logger_1.logger.error(error, `Test Language was null in booking product ${booking.details.reference}`);
                logger_1.logger.event(logger_1.BusinessTelemetryEvents.CDS_FAIL_BOOKING_CANCEL, "ManageBookingCancelController::setCancelInProgressInCRM: Failed to set status of Cancellation in Progress in CRM after 3 retries", {
                    error,
                    reference: booking.details.reference,
                });
            }
            const testType = maps_1.fromCRMProductNumber((_b = (_a = booking.details) === null || _a === void 0 ? void 0 : _a.product) === null || _b === void 0 ? void 0 : _b.productnumber);
            const viewData = {
                booking: booking.details,
                canChangeLanguage: test_language_1.TestLanguage.canChangeTestLanguage(req.session.target || enums_1.Target.GB, testType),
                testLanguage,
                voiceoverRequested,
                voiceover,
                showVoiceoverChangeButton: support_1.canShowVoiceoverChangeButton(voiceover, bslRequested),
                bslAvailable: bsl_1.bslIsAvailable(testType),
                bslRequested,
                showBslChangeButton: support_1.canShowBslChangeButton(bslRequested, voiceover),
                eligibleToBookOnline: candidate.eligibleToBookOnline,
                voiceoverAvailable: test_voiceover_1.TestVoiceover.isAvailable(testType),
                isZeroCostBooking: eligibility_1.isZeroCostTest(testType),
                testSupportNeeded: crm_helper_1.mapToSupportType(booking.details.testSupportNeed),
            };
            // If the test is not today and we don't already have the 3 working days date
            // need to call CRM to get it and store on the booking in session
            if (!booking.testIsToday() &&
                !booking.details.testDateMinus3ClearWorkingDays) {
                const { testDate, testCentre: { remit }, } = booking.details;
                const result = await this.crm.calculateThreeWorkingDays(testDate, remit);
                if (!result) {
                    return res.render("manage-booking/change", {
                        ...viewData,
                        errorCalculatingWorkingDays: true,
                    });
                }
                booking = session_1.store.manageBooking.updateBooking(req, bookingReference, {
                    testDateMinus3ClearWorkingDays: result,
                });
            }
            return res.render("manage-booking/change", {
                ...viewData,
                testIsToday: booking.testIsToday(),
                createdToday: booking.isCreatedToday(),
                bookingCannotBeCancelled: !booking.canBeCancelled(),
                bookingCannotBeRescheduled: !booking.canBeRescheduled(),
                bookingCannotBeChanged: !booking.canBeChanged(),
                lastRefundOrRescheduleDate: booking.lastRefundOrRescheduleDate,
                hasSupportedBeenRequested: !crm_helper_1.mapToSupportType(booking.details.testSupportNeed)[0].includes(enums_1.TestSupportNeed.NoSupport),
            });
        };
    }
}
exports.ManageBookingChangeController = ManageBookingChangeController;
exports.default = new ManageBookingChangeController(crm_gateway_1.CRMGateway.getInstance());
