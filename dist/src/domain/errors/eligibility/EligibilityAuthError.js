"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityAuthError = void 0;
class EligibilityAuthError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.EligibilityAuthError = EligibilityAuthError;
