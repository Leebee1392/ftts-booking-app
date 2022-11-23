"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageBookingCheckChangeController = void 0;
const language_1 = require("../../helpers/language");
const crm_gateway_1 = require("../../services/crm-gateway/crm-gateway");
const scheduling_gateway_1 = require("../../services/scheduling/scheduling-gateway");
const test_language_1 = require("../../domain/test-language");
const enums_1 = require("../../domain/enums");
const logger_1 = require("../../helpers/logger");
const builders_1 = require("../../services/notifications/content/builders");
const notifications_gateway_1 = require("../../services/notifications/notifications-gateway");
const session_1 = require("../../services/session");
const enums_2 = require("../../services/crm-gateway/enums");
const booking_manager_1 = require("../../helpers/booking-manager");
const session_helper_1 = require("../../helpers/session-helper");
const crm_helper_1 = require("../../services/crm-gateway/crm-helper");
const eligibility_1 = require("../../domain/eligibility");
const bsl_1 = require("../../domain/bsl");
const test_voiceover_1 = require("../../domain/test-voiceover");
class ManageBookingCheckChangeController {
    constructor(crm, scheduling, notifications, bookingManager) {
        this.crm = crm;
        this.scheduling = scheduling;
        this.notifications = notifications;
        this.bookingManager = bookingManager;
        this.get = (req, res) => {
            if (!req.session.manageBooking) {
                throw Error("ManageBookingCheckChangeController::get: No manageBooking set");
            }
            if (!req.session.manageBookingEdits) {
                throw Error("ManageBookingCheckChangeController::get: No manageBookingEdits set");
            }
            const { candidate, bookings } = req.session.manageBooking;
            const booking = req.session.currentBooking;
            if (!(candidate === null || candidate === void 0 ? void 0 : candidate.candidateId) ||
                !booking ||
                !bookings ||
                !bookings.length ||
                !candidate.eligibleToBookOnline) {
                return res.redirect("/manage-booking/login");
            }
            return this.renderCheckChange(req, res, candidate, booking, bookings, req.session.manageBookingEdits);
        };
        this.post = async (req, res) => {
            if (!req.session.currentBooking) {
                throw Error("ManageBookingCheckChangeController::post: No currentBooking set");
            }
            if (!req.session.manageBooking) {
                throw Error("ManageBookingCheckChangeController::post: No manageBooking set");
            }
            const { currentBooking } = req.session;
            const { bookingRef, bookingProductRef, bookingId, bookingProductId, voiceover, } = currentBooking;
            const { candidate } = req.session.manageBooking;
            logger_1.logger.debug("ManageBookingCheckChangeController::post: Current booking data", {
                currentBooking,
            });
            if (!bookingRef ||
                !bookingProductRef ||
                !bookingId ||
                !bookingProductId ||
                !voiceover ||
                !(candidate === null || candidate === void 0 ? void 0 : candidate.licenceNumber) ||
                !(candidate === null || candidate === void 0 ? void 0 : candidate.candidateId)) {
                logger_1.logger.warn("ManageBookingCheckChangeController::post: Missing required session data", {
                    bookingRef: !bookingRef,
                    bookingProductRef: !bookingProductRef,
                    bookingId: !bookingId,
                    bookingProductId: !bookingProductId,
                    voiceover: !voiceover,
                    licenceNumber: !(candidate === null || candidate === void 0 ? void 0 : candidate.licenceNumber),
                    candidateId: !(candidate === null || candidate === void 0 ? void 0 : candidate.candidateId),
                });
                throw Error("ManageBookingCheckChangeController::post: Missing required session data");
            }
            const booking = session_1.store.manageBooking.getBooking(req, bookingRef);
            if (!candidate.eligibleToBookOnline) {
                logger_1.logger.warn("ManageBookingCheckChangeController::post: Candidate is not eligible to book/reschedule online", {
                    candidateId: candidate.candidateId,
                });
                throw Error(`ManageBookingCheckChangeController::post: Candidate is not eligible to book/reschedule online ${candidate.candidateId}`);
            }
            const bookingEdits = req.session.manageBookingEdits;
            try {
                if (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.dateTime) {
                    if (!booking || !(booking === null || booking === void 0 ? void 0 : booking.canBeRescheduled())) {
                        logger_1.logger.warn("ManageBookingCheckChangeController::post: Booking cannot be rescheduled", {
                            bookingRef,
                        });
                        throw Error(`ManageBookingCheckChangeController::post: Booking cannot be rescheduled ${bookingRef}`);
                    }
                    return await this.executeDateChange(req, res, bookingRef, bookingProductRef, bookingId, bookingProductId, candidate, bookingEdits, currentBooking);
                }
                if (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.voiceover) {
                    return await this.executeVoiceoverChange(req, res, bookingRef, bookingId, bookingProductId, candidate, bookingEdits, currentBooking);
                }
                if (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.language) {
                    return await this.executeLanguageChange(req, res, bookingRef, bookingId, bookingProductId, candidate, bookingEdits, currentBooking);
                }
                if ((bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.bsl) !== undefined) {
                    // If we are looking to change the BSL within our manage booking journey.
                    return await this.executeBslChange(req, res, bookingRef, bookingId, bookingProductId, candidate, bookingEdits, currentBooking);
                }
            }
            catch (error) {
                await this.reloadBookings(req, bookingRef, candidate);
                logger_1.logger.error(error, "ManageBookingCheckChangeController::post failed executing booking changes");
                throw error;
            }
            return this.renderPost(req, res, candidate, bookingEdits);
        };
        this.renderCheckChange = (req, res, candidate, booking, bookings, manageBookingEdits) => {
            var _a, _b, _c, _d, _e, _f;
            const { centre, dateTime, language, bsl, voiceover } = manageBookingEdits;
            const viewData = {
                booking: {},
            };
            // Only date/time has changed
            if (dateTime && !centre) {
                viewData.booking.testCentre = {
                    name: (_a = booking.centre) === null || _a === void 0 ? void 0 : _a.name,
                    addressLine1: (_b = booking.centre) === null || _b === void 0 ? void 0 : _b.addressLine1,
                    addressLine2: (_c = booking.centre) === null || _c === void 0 ? void 0 : _c.addressLine2,
                    addressCounty: (_d = booking.centre) === null || _d === void 0 ? void 0 : _d.addressCounty,
                    addressCity: (_e = booking.centre) === null || _e === void 0 ? void 0 : _e.addressCity,
                    addressPostalCode: (_f = booking.centre) === null || _f === void 0 ? void 0 : _f.addressPostalCode,
                };
                viewData.booking.testDate = dateTime;
            }
            // Centre and date time has changed
            if (centre && dateTime) {
                viewData.booking.testCentre = {
                    name: centre === null || centre === void 0 ? void 0 : centre.name,
                    addressLine1: centre === null || centre === void 0 ? void 0 : centre.addressLine1,
                    addressLine2: centre === null || centre === void 0 ? void 0 : centre.addressLine2,
                    addressCounty: centre === null || centre === void 0 ? void 0 : centre.addressCounty,
                    addressCity: centre === null || centre === void 0 ? void 0 : centre.addressCity,
                    addressPostalCode: centre === null || centre === void 0 ? void 0 : centre.addressPostalCode,
                };
                viewData.booking.testDate = dateTime;
            }
            if (language) {
                const languageObj = new test_language_1.TestLanguage(language);
                viewData.booking.language = languageObj.toString();
            }
            if (voiceover) {
                viewData.booking.voiceover = this.isVoiceoverRequested(voiceover)
                    ? language_1.translate(`generalContent.language.${voiceover}`)
                    : language_1.translate("generalContent.no");
            }
            if (bsl !== undefined) {
                viewData.booking.bsl = bsl
                    ? language_1.translate("generalContent.yes")
                    : language_1.translate("generalContent.no");
            }
            return res.render("manage-booking/check-change", {
                ...viewData,
            });
        };
        this.executeDateChange = async (req, res, bookingRef, bookingProductRef, bookingId, bookingProductId, candidate, bookingEdits, currentBooking) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            const { dateTime } = bookingEdits;
            const { testType, origin, firstSelectedDate, dateAvailableOnOrAfterToday, dateAvailableOnOrBeforePreferredDate, dateAvailableOnOrAfterPreferredDate, } = currentBooking;
            const kpiIdentifiers = {
                dateAvailableOnOrAfterToday,
                dateAvailableOnOrBeforePreferredDate,
                dateAvailableOnOrAfterPreferredDate,
            };
            const centre = (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.centre) || (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre);
            const { behaviouralMarker, behaviouralMarkerExpiryDate } = candidate;
            if (!dateTime) {
                logger_1.logger.warn("ManageBookingCheckChangeController::executeDateChange: bookingEdits.dateTime is undefined");
                throw Error("ManageBookingCheckChangeController::executeDateChange: bookingEdits.dateTime is undefined");
            }
            if (!centre) {
                logger_1.logger.warn("ManageBookingCheckChangeController::executeDateChange: centre is undefined");
                throw Error("ManageBookingCheckChangeController::executeDateChange: centre is undefined");
            }
            if (!testType) {
                logger_1.logger.warn("ManageBookingCheckChangeController::executeDateChange: testType is undefined");
                throw Error("ManageBookingCheckChangeController::executeDateChange: testType is undefined");
            }
            if (!candidate.candidateId) {
                logger_1.logger.warn("ManageBookingCheckChangeController::executeDateChange: candidate.candidateId is undefined");
                throw Error("ManageBookingCheckChangeController::executeDateChange: candidate.candidateId is undefined");
            }
            try {
                logger_1.logger.info(`ManageBookingCheckChangeController::executeDateChange: Attempting to reserve a new slot in the scheduling api: ${bookingProductRef}`);
                const { reservationId } = await this.scheduling.reserveSlot(centre, testType, dateTime);
                await this.setChangeInProgressInCRM(bookingRef, bookingId, origin);
                try {
                    await this.scheduling.deleteBooking(bookingProductRef, ((_a = currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre) === null || _a === void 0 ? void 0 : _a.region) || "");
                }
                catch (e) {
                    logger_1.logger.error(e, "ManageBookingCheckChangeController::executeDateChange: Failed to delete booking");
                    if (((_b = e.response) === null || _b === void 0 ? void 0 : _b.status) === 401 || ((_c = e.response) === null || _c === void 0 ? void 0 : _c.status) === 403) {
                        logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_AUTH_ISSUE, "ManageBookingCheckChangeController::executeDateChange: Failed to authenticate to the scheduling api", {
                            e,
                            bookingProductRef,
                        });
                    }
                    else if (((_d = e.response) === null || _d === void 0 ? void 0 : _d.status) >= 400 && ((_e = e.response) === null || _e === void 0 ? void 0 : _e.status) < 500) {
                        logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_REQUEST_ISSUE, "ManageBookingCheckChangeController::executeDateChange: Failed to get request from Scheduling api", {
                            e,
                            bookingProductRef,
                        });
                    }
                    else if (((_f = e.response) === null || _f === void 0 ? void 0 : _f.status) >= 500) {
                        logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_ERROR, "ManageBookingCheckChangeController::executeDateChange: Failed to communicate with the scheduling API server", {
                            e,
                            bookingProductRef,
                        });
                    }
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_FAIL_DELETE, "ManageBookingCheckChangeController::executeDateChange: Failed to cancel the previous booking during rescheduling with the Scheduling API", {
                        e,
                        bookingProductRef,
                    });
                    throw e;
                }
                try {
                    await this.scheduling.confirmBooking([
                        {
                            bookingReferenceId: bookingProductRef,
                            reservationId,
                            notes: "",
                            behaviouralMarkers: eligibility_1.hasBehaviouralMarkerForTest(dateTime, behaviouralMarker, behaviouralMarkerExpiryDate)
                                ? eligibility_1.behaviouralMarkerLabel
                                : "",
                        },
                    ], centre.region);
                }
                catch (e) {
                    if (((_g = e.response) === null || _g === void 0 ? void 0 : _g.status) === 401 || ((_h = e.response) === null || _h === void 0 ? void 0 : _h.status) === 403) {
                        logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_AUTH_ISSUE, "ManageBookingCheckChangeController::executeDateChange: Failed to authenticate to the scheduling api", {
                            e,
                            bookingProductRef,
                            reservationId,
                        });
                    }
                    else if (((_j = e.response) === null || _j === void 0 ? void 0 : _j.status) >= 400 && ((_k = e.response) === null || _k === void 0 ? void 0 : _k.status) < 500) {
                        logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_REQUEST_ISSUE, "ManageBookingCheckChangeController::executeDateChange: Failed to get request from Scheduling api", {
                            e,
                            bookingProductRef,
                            reservationId,
                        });
                    }
                    else if (((_l = e.response) === null || _l === void 0 ? void 0 : _l.status) >= 500) {
                        logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_ERROR, "ManageBookingCheckChangeController::executeDateChange: Failed to communicate with the scheduling API server", {
                            e,
                            bookingProductRef,
                            reservationId,
                        });
                    }
                    logger_1.logger.event(logger_1.BusinessTelemetryEvents.SCHEDULING_FAIL_CONFIRM_CHANGE, "ManageBookingCheckChangeController::executeDateChange: Failed to confirm booking with the Scheduling API", {
                        e,
                        bookingProductRef,
                        reservationId,
                    });
                    const errorViewData = {
                        bookingRef,
                        slotUnavailable: false,
                        canRetry: false,
                    };
                    await this.reloadBookings(req, bookingRef, candidate);
                    session_1.store.reset(req);
                    return res.render("manage-booking/change-error", errorViewData);
                }
                try {
                    await this.updateTimeAndLocationInCrm(bookingRef, bookingId, dateTime, centre, req, candidate, origin, firstSelectedDate, kpiIdentifiers);
                    await this.updateTCNUpdateDate(bookingRef, bookingProductId, req, candidate);
                    await this.reloadBookings(req, bookingRef, candidate);
                }
                catch (e) {
                    logger_1.logger.warn("ManageBookingCheckChangeController::executeDateChange: Non-fatal, allowing user to continue to Booking Change Success page.", { bookingRef });
                    logger_1.logger.error(e, "ManageBookingCheckChangeController::executeDateChange");
                }
            }
            catch (e) {
                const errorViewData = {
                    bookingRef,
                    slotUnavailable: e instanceof scheduling_gateway_1.SlotUnavailableError,
                    canRetry: true,
                };
                await this.reloadBookings(req, bookingRef, candidate);
                return res.render("manage-booking/change-error", errorViewData);
            }
            return this.renderPost(req, res, candidate, bookingEdits);
        };
        this.executeVoiceoverChange = async (req, res, bookingRef, bookingId, bookingProductId, candidate, bookingEdits, booking) => {
            try {
                const crmVoiceover = crm_helper_1.mapVoiceoverToCRMVoiceover(bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.voiceover);
                await this.updateVoiceoverInCrm(bookingRef, bookingId, bookingProductId, crmVoiceover, booking.origin);
                await this.reloadBookings(req, bookingRef, candidate);
            }
            catch (e) {
                const errorViewData = {
                    bookingRef,
                    slotUnavailable: false,
                    canRetry: true,
                };
                await this.reloadBookings(req, bookingRef, candidate);
                return res.render("manage-booking/change-error", errorViewData);
            }
            return this.renderPost(req, res, candidate, bookingEdits);
        };
        this.executeLanguageChange = async (req, res, bookingRef, bookingId, bookingProductId, candidate, bookingEdits, booking) => {
            try {
                await this.updateLanguage(bookingRef, bookingId, bookingProductId, (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.language) === enums_1.Language.WELSH
                    ? enums_2.CRMTestLanguage.Welsh
                    : enums_2.CRMTestLanguage.English, booking.origin);
                await this.bookingManager.loadCandidateBookings(req, candidate.candidateId);
            }
            catch (e) {
                const errorViewData = {
                    bookingRef,
                    slotUnavailable: false,
                    canRetry: true,
                };
                await this.reloadBookings(req, bookingRef, candidate);
                return res.render("manage-booking/change-error", errorViewData);
            }
            return this.renderPost(req, res, candidate, bookingEdits);
        };
        this.executeBslChange = async (req, res, bookingRef, bookingId, bookingProductId, candidate, bookingEdits, booking) => {
            const { bsl } = bookingEdits;
            const { origin } = booking;
            const updatedBsl = bsl
                ? enums_2.CRMAdditionalSupport.BritishSignLanguage
                : enums_2.CRMAdditionalSupport.None;
            try {
                await this.updateAdditionalSupportInCrm(bookingRef, bookingId, bookingProductId, updatedBsl, origin);
                await this.reloadBookings(req, bookingRef, candidate);
            }
            catch (e) {
                const errorViewData = {
                    bookingRef,
                    slotUnavailable: false,
                    canRetry: true,
                };
                await this.reloadBookings(req, bookingRef, candidate);
                return res.render("manage-booking/change-error", errorViewData);
            }
            return this.renderPost(req, res, candidate, bookingEdits);
        };
        this.renderPost = async (req, res, candidate, bookingEdits) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            const { currentBooking } = req.session;
            const changedBooking = {
                ...currentBooking,
                centre: (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.centre) || (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre),
                dateTime: (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.dateTime) || (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.dateTime) || "",
                bsl: (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.bsl) || (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.bsl) || false,
                language: (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.language) || (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.language) || enums_1.Language.ENGLISH,
            };
            const { target, locale } = req.session;
            if (currentBooking) {
                await this.sendRescheduledEmail(changedBooking, candidate, target || enums_1.Target.GB, locale || enums_1.Locale.GB);
            }
            const confirmChangeViewData = {
                booking: {
                    reference: (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.bookingRef) || "",
                    language: new test_language_1.TestLanguage((bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.language) || (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.language) || "").toString(),
                    testType: currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.testType,
                    bsl: ((_a = bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.bsl) !== null && _a !== void 0 ? _a : currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.bsl)
                        ? language_1.translate("generalContent.yes")
                        : language_1.translate("generalContent.no"),
                    voiceover: (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.voiceover) ||
                        (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.voiceover) ||
                        enums_1.Voiceover.NONE,
                    testCentre: {
                        name: ((_b = bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.centre) === null || _b === void 0 ? void 0 : _b.name) || ((_c = currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre) === null || _c === void 0 ? void 0 : _c.name) || "",
                        addressLine1: ((_d = bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.centre) === null || _d === void 0 ? void 0 : _d.addressLine1) ||
                            ((_e = currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre) === null || _e === void 0 ? void 0 : _e.addressLine1),
                        addressLine2: ((_f = bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.centre) === null || _f === void 0 ? void 0 : _f.addressLine2) ||
                            ((_g = currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre) === null || _g === void 0 ? void 0 : _g.addressLine2),
                        addressCity: ((_h = bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.centre) === null || _h === void 0 ? void 0 : _h.addressCity) ||
                            ((_j = currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre) === null || _j === void 0 ? void 0 : _j.addressCity) ||
                            "",
                        addressCounty: ((_k = bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.centre) === null || _k === void 0 ? void 0 : _k.addressCounty) ||
                            ((_l = currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre) === null || _l === void 0 ? void 0 : _l.addressCounty),
                        addressPostalCode: ((_m = bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.centre) === null || _m === void 0 ? void 0 : _m.addressPostalCode) ||
                            ((_o = currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.centre) === null || _o === void 0 ? void 0 : _o.addressPostalCode) ||
                            "",
                    },
                    testDate: (bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.dateTime) || (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.dateTime) || "",
                },
                latestRefundDate: currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.lastRefundDate,
                voiceoverRequested: this.isVoiceoverRequested((bookingEdits === null || bookingEdits === void 0 ? void 0 : bookingEdits.voiceover) || (currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.voiceover)),
                bslAvailable: bsl_1.bslIsAvailable(currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.testType),
                voiceoverAvailable: test_voiceover_1.TestVoiceover.isAvailable(currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.testType),
            };
            this.resetBookingSession(req);
            const dvaInstructorTestTypes = [
                enums_1.TestType.ADIP1DVA,
                enums_1.TestType.AMIP1,
            ];
            return res.render("manage-booking/change-confirmation", {
                ...confirmChangeViewData,
                isInstructor: dvaInstructorTestTypes.includes(currentBooking === null || currentBooking === void 0 ? void 0 : currentBooking.testType),
            });
        };
        this.isVoiceoverRequested = (voiceover) => !voiceover || voiceover !== enums_1.Voiceover.NONE;
        this.sendRescheduledEmail = async (booking, candidate, target, lang) => {
            const { email, candidateId } = candidate;
            try {
                logger_1.logger.info("ManageBookingCheckChangeController::sendRescheduledEmail: Sending rescheduling email", {
                    bookingRef: booking.bookingRef,
                    candidateId,
                });
                if (!booking.bookingRef ||
                    !booking.testType ||
                    !booking.dateTime ||
                    !booking.centre ||
                    !booking.lastRefundDate) {
                    logger_1.logger.warn("ManageBookingCheckChangeController::sendRescheduledEmail: Missing data in session", {
                        bookingRef: !booking.bookingRef,
                        testType: !booking.testType,
                        dateTime: !booking.dateTime,
                        centre: !booking.centre,
                        lastRefundDate: !booking.lastRefundDate,
                        candidateId,
                    });
                    throw new Error("ManageBookingCheckChangeController::sendRescheduledEmail: Unable to generate email content due to missing data in session");
                }
                const bookingRescheduleDetails = {
                    bookingRef: booking.bookingRef,
                    testType: booking.testType,
                    testDateTime: booking.dateTime,
                    testCentre: booking.centre,
                    lastRefundDate: booking.lastRefundDate,
                };
                const emailContent = builders_1.buildBookingRescheduledEmailContent(bookingRescheduleDetails, target, lang);
                if (!email) {
                    throw new Error("ManageBookingCheckChangeController::sendRescheduledEmail Unable to send email to candidate due to missing email in session");
                }
                await this.notifications.sendEmail(email, emailContent, booking.bookingRef, target);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCheckChangeController::sendRescheduledEmail: Could not send booking reschedule email", {
                    candidateId,
                });
            }
        };
        this.reset = (req, res) => {
            var _a;
            const bookingReference = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.bookingRef;
            this.resetBookingSession(req);
            return res.redirect(`/manage-booking/${bookingReference || ""}`);
        };
        this.setChangeInProgressInCRM = async (bookingRef, bookingId, origin) => {
            try {
                logger_1.logger.debug("ManageBookingCheckChangeController::setChangeInProgressInCRM: Attempting to set booking status to Change in Progress", {
                    bookingRef,
                    bookingId,
                });
                return await this.crm.updateBookingStatus(bookingId, enums_2.CRMBookingStatus.ChangeInProgress, origin === enums_1.Origin.CustomerServiceCentre);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCheckChangeController::setChangeInProgressInCRM: Failed to set status of Change in Progress in CRM after 3 retries", {
                    bookingRef,
                    bookingId,
                });
                throw error;
            }
        };
        this.updateTimeAndLocationInCrm = async (bookingRef, bookingId, dateTime, centre, req, candidate, origin, preferredDate, kpiIdentifiers) => {
            try {
                logger_1.logger.debug("ManageBookingCheckChangeController::updateTimeAndLocationInCrm: Attempting to store updated booking location and/or time and date", {
                    bookingRef,
                    dateTime,
                    siteId: centre.siteId,
                    centreName: centre.name,
                    preferredDate,
                    ...kpiIdentifiers,
                });
                const rescheduleCount = await this.crm.getRescheduleCount(bookingId);
                await this.crm.rescheduleBookingAndConfirm(bookingId, dateTime, rescheduleCount, origin === enums_1.Origin.CustomerServiceCentre, centre.accountId, preferredDate, kpiIdentifiers);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCheckChangeController::updateTimeAndLocationInCrm: Failed to store updated booking location and/or time and date in CRM after max retries", {
                    bookingRef,
                    dateTime,
                    siteId: centre.siteId,
                    centreName: centre.name,
                });
                await this.reloadBookings(req, bookingRef, candidate);
                throw error;
            }
        };
        this.updateAdditionalSupportInCrm = async (bookingRef, bookingId, bookingProductId, additionalSupport, origin) => {
            try {
                logger_1.logger.debug("ManageBookingCheckChangeController::updateAdditionalSupportInCrm: Attempting to store updated additional support options", {
                    bookingRef,
                    bookingId,
                    bookingProductId,
                });
                await this.crm.updateAdditionalSupport(bookingId, bookingProductId, additionalSupport, origin === enums_1.Origin.CustomerServiceCentre);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCheckChangeController::updateAdditionalSupportInCrm: Failed to store updated additional support options for booking in CRM after max retries", {
                    bookingRef,
                    bookingId,
                    bookingProductId,
                });
                throw error;
            }
        };
        this.updateVoiceoverInCrm = async (bookingRef, bookingId, bookingProductId, voiceover, origin) => {
            try {
                logger_1.logger.debug("ManageBookingCheckChangeController::updateVoiceoverInCrm: Attempting to store updated voiceover", {
                    bookingRef,
                    bookingId,
                    bookingProductId,
                });
                await this.crm.updateVoiceover(bookingId, bookingProductId, voiceover, origin === enums_1.Origin.CustomerServiceCentre);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCheckChangeController::updateVoiceoverInCrm: Failed to store updated voiceover for booking in CRM after max retries", {
                    bookingRef,
                    bookingId,
                    bookingProductId,
                });
                throw error;
            }
        };
        this.updateTCNUpdateDate = async (bookingRef, bookingProductId, req, candidate) => {
            try {
                logger_1.logger.debug("ManageBookingCheckChangeController::updateTCNUpdateDate: Attempting to update TCN update date in CRM", {
                    bookingRef,
                    bookingProductId,
                });
                await this.crm.updateTCNUpdateDate(bookingProductId);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCheckChangeController::updateTCNUpdateDate: Failed to update TCN update date in CRM after max retries", {
                    bookingRef,
                    bookingProductId,
                });
                await this.reloadBookings(req, bookingRef, candidate);
                throw error;
            }
        };
        this.updateLanguage = async (bookingRef, bookingId, bookingProductId, language, origin) => {
            try {
                logger_1.logger.debug("ManageBookingCheckChangeController::updateLanguage: Attempting to store updated booking language", {
                    bookingRef,
                    bookingId,
                    bookingProductId,
                });
                await this.crm.updateLanguage(bookingId, bookingProductId, language, origin === enums_1.Origin.CustomerServiceCentre);
            }
            catch (error) {
                logger_1.logger.error(error, "ManageBookingCheckChangeController::updateLanguage: Failed to store updated booking language in CRM after max retries", {
                    bookingRef,
                    bookingId,
                    bookingProductId,
                });
                throw error;
            }
        };
    }
    async reloadBookings(req, bookingRef, candidate) {
        if (!candidate.candidateId) {
            throw new Error("ManageBookingCheckChangeController::reloadBookings: Unable to load candidate bookings no candidate id in session");
        }
        await this.bookingManager.loadCandidateBookings(req, candidate.candidateId);
        let booking = session_1.store.manageBooking.getBooking(req, bookingRef);
        if (booking) {
            booking = await this.calculateThreeWorkingDays(req, booking);
            req.session.currentBooking = {
                ...req.session.currentBooking,
                ...session_helper_1.mapBookingEntityToSessionBooking(booking),
            };
        }
    }
    async calculateThreeWorkingDays(req, booking) {
        if (booking && !booking.testIsToday()) {
            const { testDate, testCentre: { remit }, } = booking.details;
            const result = await this.crm.calculateThreeWorkingDays(testDate, remit);
            return session_1.store.manageBooking.updateBooking(req, booking.details.reference, {
                testDateMinus3ClearWorkingDays: result,
            });
        }
        // Update is when you change voiceover language | accommodations etc.
        return booking;
    }
    resetBookingSession(req) {
        req.session.manageBookingEdits = undefined;
        req.session.currentBooking = undefined;
        req.session.testCentreSearch = undefined;
        req.session.journey = {
            ...req.session.journey,
            inManagedBookingEditMode: false,
        };
    }
}
exports.ManageBookingCheckChangeController = ManageBookingCheckChangeController;
exports.default = new ManageBookingCheckChangeController(crm_gateway_1.CRMGateway.getInstance(), scheduling_gateway_1.SchedulingGateway.getInstance(), notifications_gateway_1.notificationsGateway, booking_manager_1.BookingManager.getInstance(crm_gateway_1.CRMGateway.getInstance()));
