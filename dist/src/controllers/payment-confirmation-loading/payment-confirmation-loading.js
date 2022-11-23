"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentConfirmationLoading = void 0;
const config_1 = __importDefault(require("../../config"));
const logger_1 = require("../../helpers/logger");
class PaymentConfirmationLoading {
    constructor() {
        this.get = (req, res) => {
            var _a;
            const { currentBooking: booking } = req.session;
            if (!(booking === null || booking === void 0 ? void 0 : booking.bookingRef)) {
                logger_1.logger.critical("PaymentConfirmationLoading:: get : Missing required booking reference number");
                throw new Error("PaymentConfirmationLoading:: get : Missing required booking reference number");
            }
            const redirectUrl = ((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.isInstructor)
                ? `/instructor/payment-confirmation/${booking.bookingRef}`
                : `/payment-confirmation/${booking.bookingRef}`;
            return res.render("create/payment-confirmation-loading", {
                redirectUrl,
                refreshTime: config_1.default.refreshTimeForLandingPage,
            });
        };
    }
}
exports.PaymentConfirmationLoading = PaymentConfirmationLoading;
exports.default = new PaymentConfirmationLoading();
