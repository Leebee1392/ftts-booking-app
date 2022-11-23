"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyMismatchError = void 0;
class AgencyMismatchError extends Error {
    constructor(message) {
        super(message || "Booking does not match agency");
        this.name = this.constructor.name;
    }
}
exports.AgencyMismatchError = AgencyMismatchError;
