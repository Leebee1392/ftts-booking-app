"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeNotifyMarkdown = exports.formatSupportTypes = exports.formatAddressLines = void 0;
const language_1 = require("../../../helpers/language");
const formatAddressLines = (centre) => {
    const addressFields = [
        centre.name,
        centre.addressLine1,
        centre.addressLine2,
        centre.addressCity,
        centre.addressPostalCode,
    ];
    return addressFields
        .filter(Boolean) // Skip if empty/null
        .join("\n");
};
exports.formatAddressLines = formatAddressLines;
const formatSupportTypes = (supportTypes) => {
    const translated = supportTypes.map((type) => language_1.translate(`generalContent.abbreviatedSupportTypes.${type}`));
    return translated.join(", ");
};
exports.formatSupportTypes = formatSupportTypes;
// Regex to match gov notify markdown syntax #,*,^,--- in user input and escape with backslash
const escapeNotifyMarkdown = (input) => input.replace(/#|\*|\^|---/g, "\\\\$&");
exports.escapeNotifyMarkdown = escapeNotifyMarkdown;
