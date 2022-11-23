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
    return "Bydd hyn yn cael ei benderfynu yn ddiweddarach";
};
const getPreferredLocationText = (preferredLocationText) => {
    if (preferredLocationText) {
        return preferredLocationText;
    }
    return "Bydd hyn yn cael ei benderfynu yn ddiweddarach";
};
exports.default = {
    subject: "DVSA: eich cais am gymorth am eich prawf theori",
    buildBody: (details) => ts_dedent_1.default `
    # Diolch am eich cais am gymorth gyda'ch prawf theori gyrru

    # Eich cyfeirnod ${details.reference}

    Cadwch y cyfeirnod hwn yn ddiogel. Bydd ei angen arnoch os oes angen i chi siarad â ni. Gall fod yn ddefnyddiol argraffu'r e-bost hwn.

    # Pwysig

    Ar hyn o bryd rydym yn ymateb i nifer fawr o ymholiadau ond byddwn yn cysylltu â chi cyn gynted â phosibl er mwyn trefnu eich prawf theori.


    # Eich manylion prawf a chymorth

    Math o brawf: ${language_1.translate(`generalContent.testTypes.${details.testType}`)}

    Iaith ar sgrîn: ${language_1.translate(`generalContent.language.${details.testLanguage}`)}

    Cymorth sydd angen: ${isSupportRequested(details.supportTypes)}

    Y mathau o gymorth a ddewiswyd: ${helpers_1.formatSupportTypes(details.supportTypes)}

    Amser sy'n well gennych ar gyfer y prawf: ${getPreferredDayText(details.preferredDay.text)}

    Y lleoliadau sy'n well gennych ar gyfer y prawf: ${getPreferredLocationText(details.preferredDay.text)}


    # Tystiolaeth

    Mae angen tystiolaeth ar rai mathau o gymorth. Mae hwn fel arfer ar ffurf llythyr, e-bost, asesiad diagnostig neu adroddiad gan weithiwr proffesiynol addysgol neu feddygol, therapydd galwedigaethol neu sefydliad swyddogol.


    # Os ydych wedi darparu tystiolaeth o’r blaen

    Os gwnaethoch ddarparu tystiolaeth ar gyfer prawf theori fe wnaethoch fethu, nid oes angen i ni ei weld eto oni bai bod y cymorth sydd ei angen arnoch wedi newid.


    # Gallwch hefyd gysylltu â ni

    Ymholiadau prawf theori DVSA
    E-bost:  [theorycustomerservices@dvsa.gov.uk](mailto:theorycustomerservices@dvsa.gov.uk)
    Ffôn: 0300 200 1122
    Dydd Llun i ddydd Gwener, 8yb i 4yh
  `,
};
