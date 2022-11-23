"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const language_1 = require("../../../../../helpers/language");
const helpers_1 = require("../../helpers");
const isSupportRequested = (supportTypes) => {
    if (supportTypes.length) {
        return language_1.translate("generalContent.yes");
    }
    return language_1.translate("generalContent.no");
};
const getPreferredDayText = (preferredDayText) => {
    if (preferredDayText) {
        return preferredDayText;
    }
    return "To be decided later";
};
const getPreferredLocationText = (preferredLocationText) => {
    if (preferredLocationText) {
        return preferredLocationText;
    }
    return "To be decided later";
};
exports.default = {
    subject: "DVA: your theory test support request",
    buildBody: (details) => ts_dedent_1.default `
    # Thank you for your driving theory test support request

    # Your reference ${details.reference}

    Keep this reference safe. You will need it to talk to us. It may be useful to print this email.

    # Important
    We are currently responding to a high number of enquiries and we will contact you as soon as possible to arrange your theory test.


    # Your test and support details

    Test type: ${language_1.translate(`generalContent.testTypes.${details.testType}`)}

    On-screen language: ${language_1.translate(`generalContent.language.${details.testLanguage}`)}

    Support requested: ${isSupportRequested(details.supportTypes)}

    Support types you selected: ${helpers_1.formatSupportTypes(details.supportTypes)}

    Preferred time for test: ${getPreferredDayText(details.preferredDay.text)}

    Preferred locations for test: ${getPreferredLocationText(details.preferredLocation.text)}


    # Evidence

    Some kinds of support require evidence. This is usually a letter, email, diagnostic assessment or report from an educational or medical professional, an occupational therapist or an official organisation.


    # If you've provided evidence before

    If you provided evidence for a theory test you failed, we don't need to see it again unless the support you need has changed.


    # You can also contact us

    DVA theory test enquiries
    Email: [dva.theorytestsupportni@dvsa.gov.uk](mailto:dva.theorytestsupportni@dvsa.gov.uk)
    Telephone: 0345 600 6700
    Monday to Friday, 8am to 4pm
  `,
};
