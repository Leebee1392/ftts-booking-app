"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCustomSupportInputEmptyOrUnmeaningful = void 0;
const custom_support_unmeaningful_phrases_1 = require("./custom-support-unmeaningful-phrases");
const normalise = (input) => input
    .toUpperCase()
    .replace(/\s/g, "") // Strip all spaces
    .replace(/[^A-Z]/g, ""); // Strip non-letter characters
const normalisedUnmeaningfulPhrases = custom_support_unmeaningful_phrases_1.unmeaningfulPhrases.map(normalise);
const isCustomSupportInputEmptyOrUnmeaningful = (input) => {
    const normalisedInput = normalise(input);
    return (normalisedInput === "" ||
        normalisedUnmeaningfulPhrases.includes(normalisedInput));
};
exports.isCustomSupportInputEmptyOrUnmeaningful = isCustomSupportInputEmptyOrUnmeaningful;
