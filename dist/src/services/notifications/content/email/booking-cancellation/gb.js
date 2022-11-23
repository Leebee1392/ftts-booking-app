"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const language_1 = require("../../../../../helpers/language");
const local_date_time_filter_1 = require("../../../../../nunjucks-filters/local-date-time-filter");
exports.default = {
    subject: "DVSA: your driving theory test has been cancelled",
    buildBody: (details) => ts_dedent_1.default `
    # Your ${language_1.translate(`generalContent.testTypes.${details.testType}`)} driving theory test is cancelled

    # Booking reference ${details.bookingRef}

    We've cancelled the driving theory test you were due to take at ${local_date_time_filter_1.asLocalTime(details.testDateTime)} on ${local_date_time_filter_1.asFullDateWithWeekday(details.testDateTime)}

    ---
    If you did not cancel this test please contact us immediately. You can reply to this email or telephone ${language_1.translate("generalContent.cancelContact.phone")}.

    Tests cancelled more than 3 clear working days before the test date will be refunded.

    ---
    # Booking another test
    You can book a driving theory test here:
    https://www.gov.uk/book-theory-test

    ---
    # Prepare for a test
    Learn more about preparing for a car theory test including free practice tests here: https://www.gov.uk/theory-test/revision-and-practice

    ---
    https://www.gov.uk/browse/driving/learning-to-drive
  `,
};
