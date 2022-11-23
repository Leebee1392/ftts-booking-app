"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityNotLatestLicenceError = void 0;
class EligibilityNotLatestLicenceError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.EligibilityNotLatestLicenceError = EligibilityNotLatestLicenceError;
