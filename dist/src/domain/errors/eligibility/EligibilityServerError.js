"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityServerError = void 0;
class EligibilityServerError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.EligibilityServerError = EligibilityServerError;
