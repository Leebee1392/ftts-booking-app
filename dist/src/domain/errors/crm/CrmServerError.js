"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmServerError = void 0;
class CrmServerError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.CrmServerError = CrmServerError;
