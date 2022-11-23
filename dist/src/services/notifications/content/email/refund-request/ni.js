"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const language_1 = require("../../../../../helpers/language");
exports.default = {
    subject: "DVA: Your driving theory test refund request has been received",
    buildBody: (details) => ts_dedent_1.default `
  # We have received your driving theory test refund request

  ---
  # Cancelled theory test booking reference: ${details.bookingRef}
  ---

  Your refund request for a cancelled driving theory test has been received.

  # What happens next

  Refunds are sent to the account used for the original payment.

  You can book a new theory test at https://www.nidirect.gov.uk/services/book-your-theory-test-online

  If you are a driving instructor, use: https://www.nidirect.gov.uk/services/book-your-adi-or-ami-theory-test-online

  # DVA theory test booking support

  dva.theorycustomerservices@dvsa.gov.uk
  Telephone: ${language_1.translate("generalContent.cancelContact.phone")}
  Monday to Friday, 8am to 4pm (except public holidays)
  `,
};
