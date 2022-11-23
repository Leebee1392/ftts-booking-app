"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmCreateUpdateCandidateError = void 0;
class CrmCreateUpdateCandidateError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.CrmCreateUpdateCandidateError = CrmCreateUpdateCandidateError;
