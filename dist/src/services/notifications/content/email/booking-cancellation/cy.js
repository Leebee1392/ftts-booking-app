"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const language_1 = require("../../../../../helpers/language");
const local_date_time_filter_1 = require("../../../../../nunjucks-filters/local-date-time-filter");
exports.default = {
    subject: "DVSA: mae'ch prawf theori gyrru wedi'i ganslo",
    buildBody: (details) => ts_dedent_1.default `
    # Mae'ch prawf theori gyrru ${language_1.translate(`generalContent.testTypes.${details.testType}`)} wedi'i ganslo

    # Cyfeirnod archeb ${details.bookingRef}

    Rydym wedi canslo'r prawf theori gyrru roeddech i'w sefyll am ${local_date_time_filter_1.asLocalTime(details.testDateTime)} dydd ${local_date_time_filter_1.asFullDateWithWeekday(details.testDateTime)}.

    ---
    Os nad oeddech wedi canslo'r prawf hwn, cysylltwch â ni ar unwaith. Gallwch ymateb i'r e-bost hwn neu ffonio ${language_1.translate("generalContent.cancelContact.phone")}.

    Bydd profion sy'n cael eu dileu mwy na 3 diwrnod gwaith clir cyn dyddiad y prawf yn cael eu had-dalu.

    ---
    # Archebu prawf arall
    Gallwch archebu prawf theori gyrru yma:
    https://www.gov.uk/book-theory-test

    ---
    # Paratoi ar gyfer y prawf
    Dysgwch fwy am baratoi ar gyfer prawf theori car gan gynnwys profion ymarfer am ddim yma:
    https://www.gov.uk/theory-test/revision-and-practice

    ---
    https://www.gov.uk/browse/driving/learning-to-drive
  `,
};
