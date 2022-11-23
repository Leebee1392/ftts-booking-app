"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingReference = exports.emptyBookingReferenceErrorMsg = void 0;
/* eslint-disable security/detect-unsafe-regex */
const trimWhitespace = (input) => input.replace(/\s+/g, "");
exports.emptyBookingReferenceErrorMsg = "Booking reference is empty";
class BookingReference {
    constructor(value) {
        this.value = value;
    }
    static of(input) {
        if (!input) {
            throw new Error(exports.emptyBookingReferenceErrorMsg);
        }
        const trimmedInput = trimWhitespace(input);
        if (!trimmedInput) {
            throw new Error(exports.emptyBookingReferenceErrorMsg);
        }
        // Matches CRM booking reference format
        const bookingReferenceRegex = /^[A-Za-z](-\d{3}){3}?$/;
        if (!bookingReferenceRegex.test(trimmedInput)) {
            throw new Error("not a valid booking reference number");
        }
        return new BookingReference(input);
    }
    static isValid(bookingReference) {
        return BookingReference.of(bookingReference) instanceof BookingReference;
    }
    toString() {
        return this.value;
    }
}
exports.BookingReference = BookingReference;
