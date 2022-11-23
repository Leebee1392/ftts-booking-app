"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmCreateBookingDataError = void 0;
class CrmCreateBookingDataError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
exports.CrmCreateBookingDataError = CrmCreateBookingDataError;
