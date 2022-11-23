"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const language_1 = require("../../../../../helpers/language");
const helpers_1 = require("../../helpers");
exports.default = {
    subject: "DVA: your theory test support request",
    buildBody: (details) => ts_dedent_1.default `
    # Thank you for your driving theory test support request

    # Your reference ${details.reference}

    Keep this reference safe. You will need it if you need to talk to us. It may be useful to print this email.

    # Important

    We are currently responding to a high number of enquiries and we will contact you as soon as possible to arrange your theory test.

    # Your test and support details

    Test type: ${language_1.translate(`generalContent.testTypes.${details.testType}`)}
    On-screen language: ${language_1.translate(`generalContent.language.${details.testLanguage}`)}
    Support requested: ${details.supportTypes.length > 0
        ? language_1.translate("generalContent.yes")
        : language_1.translate("generalContent.no")}
    Support types you selected: ${helpers_1.formatSupportTypes(details.supportTypes)}
    Preferred time for test: ${details.preferredDay.text
        ? helpers_1.escapeNotifyMarkdown(details.preferredDay.text)
        : "I will decide this later"}
    Preferred locations for test: ${details.preferredLocation.text
        ? helpers_1.escapeNotifyMarkdown(details.preferredLocation.text)
        : "I will decide this later"}

    # You can also contact us

    DVSA theory test enquiries
    Email: dva.theorytestsupportni@dvsa.gov.uk
    Telephone: 0345 600 6700
    Monday to Friday, 8am to 4pm
  `,
};
