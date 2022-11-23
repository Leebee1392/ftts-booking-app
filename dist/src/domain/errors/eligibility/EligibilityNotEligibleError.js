"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityNotEligibleError = void 0;
class EligibilityNotEligibleError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.EligibilityNotEligibleError = EligibilityNotEligibleError;
