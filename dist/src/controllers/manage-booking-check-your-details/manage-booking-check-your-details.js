"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageBookingCheckYourDetailsController = void 0;
const session_1 = require("../../services/session");
const enums_1 = require("../../services/crm-gateway/enums");
const crm_helper_1 = require("../../services/crm-gateway/crm-helper");
const maps_1 = require("../../services/crm-gateway/maps");
const helpers_1 = require("../../helpers");
const test_language_1 = require("../../domain/test-language");
const test_voiceover_1 = require("../../domain/test-voiceover");
const enums_2 = require("../../domain/enums");
class ManageBookingCheckYourDetailsController {
    constructor() {
        this.get = (req, res) => this.renderPage(req, res);
        this.post = (req) => {
            helpers_1.logger.debug("check-your-details::post: Post method is called", {
                // TODO FTT-19395: Remove
                request: req.body,
            });
        };
        this.renderPage = (req, res) => {
            var _a;
            // Call the store to get the manage booking bookings for the candidate (we must start in the manage booking home screen to get this)
            const { licenceNumber, email, telephone, dateOfBirth, surname, firstnames, } = (_a = req.session.manageBooking) === null || _a === void 0 ? void 0 : _a.candidate;
            const { target } = req.session;
            // ! START OF TEST - Remove once we have this in previous ticket (Completed as part of FTT-19136)
            const bookings = session_1.store.manageBooking.getBookings(req);
            let exampleBooking = null;
            bookings.forEach((booking) => {
                if (booking.details.bookingStatus === enums_1.CRMBookingStatus.Draft) {
                    const nsaBookingSlots = booking.details
                        .nsaBookingSlots;
                    if (nsaBookingSlots.length > 0) {
                        exampleBooking = booking.details;
                    }
                }
            });
            if (exampleBooking === null) {
                throw new Error("No booking available!");
            }
            const nsaBooking = exampleBooking;
            const centre = {
                name: "Birmingham",
                addressLine1: "155 Great Charles Street Queensway",
                addressLine2: "",
                addressCounty: "West Midlands",
                addressCity: "Birmingham",
                addressPostalCode: "B3 3LP",
            };
            const testDate = "2022-11-10";
            // ! END OF TEST
            const candidateName = firstnames === "---" && target === enums_2.Target.GB
                ? surname
                : `${firstnames} ${surname}`;
            const { reference, product, price, voiceoverLanguage, voicemailmessagespermitted, testSupportNeed, additionalSupport, foreignlanguageselected, } = nsaBooking;
            const testType = maps_1.fromCRMProductNumber(product === null || product === void 0 ? void 0 : product.productnumber);
            const bsl = additionalSupport === enums_1.CRMAdditionalSupport.BritishSignLanguage;
            const voiceover = test_voiceover_1.TestVoiceover.fromCRMVoiceover(voiceoverLanguage);
            const testLanguage = test_language_1.TestLanguage.fromCRMTestLanguage(nsaBooking.testLanguage);
            const supportTypes = crm_helper_1.mapToSupportType(testSupportNeed);
            return res.render("manage-booking/check-your-details", {
                target,
                candidateName,
                dateOfBirth,
                licenceNumber,
                supportTypes,
                foreignlanguageselected,
                testLanguage,
                voiceover,
                testType,
                bsl,
                telephoneNumber: telephone,
                emailAddress: email,
                voicemail: voicemailmessagespermitted,
                bookingReference: reference,
                cost: price,
                dateTime: testDate,
                testCentre: centre,
            });
        };
    }
}
exports.ManageBookingCheckYourDetailsController = ManageBookingCheckYourDetailsController;
exports.default = new ManageBookingCheckYourDetailsController();
