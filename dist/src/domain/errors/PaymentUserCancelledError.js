"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentUserCancelledError = void 0;
class PaymentUserCancelledError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}
exports.PaymentUserCancelledError = PaymentUserCancelledError;
