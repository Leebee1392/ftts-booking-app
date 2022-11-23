"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSystemError = void 0;
class PaymentSystemError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}
exports.PaymentSystemError = PaymentSystemError;
