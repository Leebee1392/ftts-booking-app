"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityLicenceNotFoundError = void 0;
class EligibilityLicenceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.EligibilityLicenceNotFoundError = EligibilityLicenceNotFoundError;
