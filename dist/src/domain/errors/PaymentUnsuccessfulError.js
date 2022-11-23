"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentUnsuccessfulError = void 0;
class PaymentUnsuccessfulError extends Error {
    constructor() {
        super();
        this.name = this.constructor.name;
    }
}
exports.PaymentUnsuccessfulError = PaymentUnsuccessfulError;
