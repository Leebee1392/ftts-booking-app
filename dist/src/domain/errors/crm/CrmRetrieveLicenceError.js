"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmRetrieveLicenceError = void 0;
class CrmRetrieveLicenceError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.CrmRetrieveLicenceError = CrmRetrieveLicenceError;
