"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenceNumber = void 0;
const enums_1 = require("./enums");
const licenceNumberRegex = {
    // Regex taken from the DVLA Access to Driver Data spec
    gb: /^(?=.{16}$)[A-Za-z]{1,5}9{0,4}[0-9](?:[05][1-9]|[16][0-2])(?:[0][1-9]|[12][0-9]|3[01])[0-9](?:99|[A-Za-z][A-Za-z9])(?![IOQYZioqyz01_])\w[A-Za-z]{2}/,
    // ni:
    ni: /\b[0-9]{8}\b/,
};
const licenceNumberMatchesGbFormat = (dln) => licenceNumberRegex.gb.test(dln);
const licenceNumberMatchesNiFormat = (dln) => licenceNumberRegex.ni.test(dln);
const trimWhitespace = (input) => input.replace(/\s+/g, "");
const sliceToFirst16Chars = (input) => input.slice(0, 16);
class LicenceNumber {
    constructor(value) {
        this.value = value;
    }
    static of(input, target) {
        const trimmedInput = trimWhitespace(input);
        if (!trimmedInput) {
            throw new Error("Licence number input is empty");
        }
        if (target === enums_1.Target.NI) {
            // NI licence number is 8 numeric characters
            // The 8th number is a checksum - this is not being validated
            // It should be handled by Eligibility API
            if (!licenceNumberMatchesNiFormat(trimmedInput)) {
                throw new Error("not a valid NI licence number");
            }
            return new LicenceNumber(trimmedInput);
        }
        // GB licence number is 16 chars but users may mistakenly add
        // the extra 2-character issue number printed on the licence,
        // so slice it before validating
        const licenceNumber = trimmedInput.length > 16
            ? sliceToFirst16Chars(trimmedInput)
            : trimmedInput;
        if (!licenceNumberMatchesGbFormat(licenceNumber) &&
            !licenceNumberMatchesNiFormat(licenceNumber)) {
            throw new Error("not a valid GB or NI licence number");
        }
        return new LicenceNumber(licenceNumber);
    }
    static isValid(licenceNumber, { req }) {
        var _a, _b;
        return (LicenceNumber.of(licenceNumber, ((_b = (_a = req === null || req === void 0 ? void 0 : req.res) === null || _a === void 0 ? void 0 : _a.locals) === null || _b === void 0 ? void 0 : _b.target) || enums_1.Target.GB) instanceof LicenceNumber);
    }
    toString() {
        return this.value;
    }
    equals(other) {
        return this.value.toUpperCase() === other.value.toUpperCase();
    }
}
exports.LicenceNumber = LicenceNumber;
