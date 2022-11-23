"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentConfirmationError = void 0;
class PaymentConfirmationError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}
exports.PaymentConfirmationError = PaymentConfirmationError;
