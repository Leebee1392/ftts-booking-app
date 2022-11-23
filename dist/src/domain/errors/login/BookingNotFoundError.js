"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingNotFoundError = void 0;
class BookingNotFoundError extends Error {
    constructor(message) {
        super(message ||
            "Booking not found or is not an active booking for this candidate");
        this.name = this.constructor.name;
    }
}
exports.BookingNotFoundError = BookingNotFoundError;
