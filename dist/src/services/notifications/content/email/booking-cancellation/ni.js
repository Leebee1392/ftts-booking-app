"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const language_1 = require("../../../../../helpers/language");
const local_date_time_filter_1 = require("../../../../../nunjucks-filters/local-date-time-filter");
const eligibility_1 = require("../../../../../domain/eligibility");
exports.default = {
    subject: "DVA: your driving theory test has been cancelled",
    buildBody: (details) => {
        let bookTheoryTestLink = language_1.translate("generalContent.footer.bookingLinkUrl");
        let prepareForTestUrl = "https://www.nidirect.gov.uk/articles/preparing-theory-test";
        if (eligibility_1.INSTRUCTOR_TEST_TYPES.includes(details.testType)) {
            bookTheoryTestLink = language_1.translate("generalContent.footer.instructorBookingLinkUrl");
            prepareForTestUrl =
                "https://www.nidirect.gov.uk/information-and-services/driving-living/driving-instructors";
        }
        return ts_dedent_1.default `
    # Your ${language_1.translate(`generalContent.testTypes.${details.testType}`)} driving theory test is cancelled

    # Booking reference ${details.bookingRef}

    We've cancelled the driving theory test you were due to take at ${local_date_time_filter_1.asLocalTime(details.testDateTime)} on ${local_date_time_filter_1.asFullDateWithWeekday(details.testDateTime)}

    ---
    If you did not cancel this test please contact us immediately. You can reply to this email or telephone ${language_1.translate("generalContent.cancelContact.phone")}.

    Tests cancelled more than 3 clear working days before the test date will be refunded.

    ---
    # Booking another test
    You can book a driving theory test here:
    ${bookTheoryTestLink};

    ---
    # Prepare for a test
    Learn more about preparing for a car theory test including free practice tests here: ${prepareForTestUrl}

    ---
  `;
    },
};
