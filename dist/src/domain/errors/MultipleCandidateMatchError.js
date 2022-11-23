"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleCandidateMismatchError = void 0;
class MultipleCandidateMismatchError extends Error {
    constructor(errors) {
        super("Candidate does not match eligibility details");
        this.name = this.constructor.name;
        this.errors = errors;
    }
}
exports.MultipleCandidateMismatchError = MultipleCandidateMismatchError;
