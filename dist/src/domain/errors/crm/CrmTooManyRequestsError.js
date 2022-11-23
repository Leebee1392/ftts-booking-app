"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmTooManyRequestsError = void 0;
class CrmTooManyRequestsError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.CrmTooManyRequestsError = CrmTooManyRequestsError;
