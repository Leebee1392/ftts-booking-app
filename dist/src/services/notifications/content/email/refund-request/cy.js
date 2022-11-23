"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = __importDefault(require("ts-dedent"));
exports.default = {
    subject: "DVSA: Derbyniwyd eich cais am ad-daliad prawf theori gyrru",
    buildBody: (details) => ts_dedent_1.default `
  # Rydym wedi derbyn eich cais am ad-daliad prawf theori gyrru

  ---
  # Cyfeirnod archebu prawf theori sydd wedi cael ei ganslo: ${details.bookingRef}
  ---

  Derbyniwyd eich cais am ad-daliad prawf theori gyrru sydd wedi cael ei ganslo.

  # Beth sy'n digwydd nesaf

  Anfonir ad-daliadau i'r cyfrif a ddefnyddiwyd ar gyfer y taliad gwreiddiol.

  Gallwch archebu prawf theori newydd ar GOV.UK. https://www.gov.uk/book-theory-test

  Os ydych yn hyfforddwr gyrru, defnyddiwch: https://www.gov.uk/book-your-instructor-theory-test

  # Cymorth archebu prawf theori’r DVSA

  TheoryCustomerServices@dvsa.gov.uk
  Teleffon: 0300 200 1122
  Dydd Llun i ddydd Gwener, 8am i 4pm (ac eithrio gwyliau cyhoeddus)
  `,
};
