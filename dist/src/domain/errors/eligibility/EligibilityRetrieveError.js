"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityRetrieveError = void 0;
class EligibilityRetrieveError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.EligibilityRetrieveError = EligibilityRetrieveError;
