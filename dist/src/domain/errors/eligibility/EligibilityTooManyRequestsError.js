"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityTooManyRequestsError = void 0;
class EligibilityTooManyRequestsError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}
exports.EligibilityTooManyRequestsError = EligibilityTooManyRequestsError;
