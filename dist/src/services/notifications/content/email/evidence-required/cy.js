"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const enums_1 = require("../../../../../domain/enums");
const evidence_helper_1 = require("../../../../../helpers/evidence-helper");
const language_1 = require("../../../../../helpers/language");
const helpers_1 = require("../../helpers");
const optionalDeafCandidateSection = (details) => {
    if (evidence_helper_1.isDeafCandidate(details.supportTypes) &&
        details.supportTypes.includes(enums_1.SupportType.EXTRA_TIME)) {
        return ts_dedent_1.default `
      # Achosion pan nad oes angen i chi ddarparu tystiolaeth

      Nid oes angen i chi ddarparu tystiolaeth os ydych yn fyddar neu os oes gennych nam ar y clyw ac yn gofyn am gymorth yn ymwneud â byddardod, yn ogystal ag amser ychwanegol. Os gwnaethoch ofyn am unrhyw fath arall o gymorth bydd angen i chi ddarparu tystiolaeth.
    `;
    }
    return "";
};
exports.default = {
    subject: "DVSA: eich cais am gymorth am eich prawf theori",
    buildBody: (details) => ts_dedent_1.default `
    # Anfonwch dystiolaeth atom i gwblhau eich cais

    Ni fydd eich cais yn cael ei brosesu hyd nes y derbynnir y dystiolaeth hon.

    # Eich cyfeirnod ${details.reference}

    Cadwch y cyfeirnod hwn yn ddiogel. Bydd ei angen arnoch os oes angen i chi siarad â ni. Gall fod yn ddefnyddiol i argraffu'r e-bost hwn.

    # Pwysig

    Ar hyn o bryd rydym yn ymateb i nifer fawr o ymholiadau ond byddwn yn cysylltu â chi cyn gynted â phosibl er mwyn trefnu eich prawf theori.

    # Eich manylion prawf a chymorth

    Math o brawf: ${language_1.translate(`generalContent.testTypes.${details.testType}`)}
    Iaith ar sgrîn: ${language_1.translate(`generalContent.language.${details.testLanguage}`)}
    Cymorth sydd angen: ${details.supportTypes.length > 0
        ? language_1.translate("generalContent.yes")
        : language_1.translate("generalContent.no")}
    Y mathau o gymorth a ddewiswyd: ${helpers_1.formatSupportTypes(details.supportTypes)}
    Amser sy'n well gennych ar gyfer y prawf: ${details.preferredDay.text
        ? helpers_1.escapeNotifyMarkdown(details.preferredDay.text)
        : "Byddaf yn gwneud y penderfyniad hwn yn hwyrach"}
    Y lleoliadau sy'n well gennych ar gyfer y prawf: ${details.preferredLocation.text
        ? helpers_1.escapeNotifyMarkdown(details.preferredLocation.text)
        : "Byddaf yn gwneud y penderfyniad hwn yn hwyrach"}

    # Yr hyn mae'n rhaid i chi ei wneud nawr

    # E-bostio eich tystiolaeth

    E-bostio eich dogfennau tystiolaeth at: theorytestsupport@dvsa.gov.uk

    Gallwch anfon cymaint o ddogfennau ag sydd eu hangen arnoch er mwyn darparu tystiolaeth.

    # Pwysig

    Er mwyn helpu i gyflymu'ch cais am gymorth, cynhwyswch eich:
    1. cyfeirnod cais am gymorth  ${details.reference}
    2. enw llawn
    3. rhif trwydded yrru

    # Ffyrdd eraill i anfon tystiolaeth

    Fel arall, gallwch bostio eich tystiolaeth i:

    Asiantaeth Safonau Gyrwyr a Cherbydau
    PO Box 349
    Newcastle upon Tyne
    NE12 2GN

    ${optionalDeafCandidateSection(details)}

    # Eich tystiolaeth

    Sicrhewch bod eich tystiolaeth:

    * ar ffurf llythyr, e-bost, asesiad diagnostig neu adroddiad
    * yn dod o weithiwr proffesiynol addysgol neu feddygol, therapydd galwedigaethol neu sefydliad perthnasol
    * yn cadarnhau eich cyflwr
    *  yn cynnwys eich enw cyntaf a chyfenw
    * wedi'i lofnodi ac ar bapur swyddogol os yw'n llythyr neu'n adroddiad

    Gallwch ddysgu mwy am dystiolaeth ar wefan y llywodraeth yma: https://www.gov.uk/theory-test/reading-difficulty-disability-or-health-condition

    # Pan dderbyniwn eich tystiolaeth

    Byddwn yn gwirio'ch tystiolaeth i sicrhau ei fod yn eich galluogi i gael y cymorth cywir. Byddwn yn cysylltu â chi pan fyddwn wedi gwneud hyn.

    # Gallwch hefyd gysylltu â ni

    Ymholiadau prawf theori DVSA E-bost: theorycustomerservices@dvsa.gov.uk
    Ffôn: 0300 200 1122
    Dydd Llun i ddydd Gwener, 8yb i 4yh
  `,
};
