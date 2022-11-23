"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.afterTheTest = void 0;
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const language_1 = require("../../../../../helpers/language");
const config_1 = __importDefault(require("../../../../../config"));
const afterTheTest = () => {
    if (config_1.default.featureToggles.digitalResultsEmailInfo) {
        return ts_dedent_1.default `

    ---
    # ${language_1.translate("bookingConfirmation.afterTheTestSubheading")}
    ${language_1.translate("bookingConfirmation.afterTheTestParagraph")}
    `;
    }
    return "";
};
exports.afterTheTest = afterTheTest;
