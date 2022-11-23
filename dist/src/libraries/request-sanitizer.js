"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xssSanitise = exports.stringToArray = void 0;
const xss_filters_1 = __importDefault(require("xss-filters"));
function stringToArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "string") {
        return [value];
    }
    return [];
}
exports.stringToArray = stringToArray;
function xssSanitise(searchTerm) {
    // allow spaces, alphanumeric chars along with some punctuation
    const allowedChars = /[^A-Za-zÀ-ÖØ-öø-ÿ0-9,.\- ]/g;
    const xssFilteredSearchTerm = xss_filters_1.default.inHTMLData(searchTerm);
    return xssFilteredSearchTerm.replace(allowedChars, "").replace(/\\/g, "");
}
exports.xssSanitise = xssSanitise;
