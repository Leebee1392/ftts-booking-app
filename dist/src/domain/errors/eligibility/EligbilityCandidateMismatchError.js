"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligbilityCandidateMismatchError = void 0;
class EligbilityCandidateMismatchError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.EligbilityCandidateMismatchError = EligbilityCandidateMismatchError;
