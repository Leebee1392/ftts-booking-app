"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.byTestDateSoonestFirst = exports.Booking = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const enums_1 = require("../../services/crm-gateway/enums");
class Booking {
    constructor(details) {
        this.details = details;
    }
    static from(details) {
        return new Booking(details);
    }
    isViewable() {
        return (((this.isConfirmed() ||
            this.isCancellationInProgress() ||
            this.isChangeInProgress() ||
            (this.isNSABooking() && this.isDraft())) &&
            !this.isInThePast()) ||
            this.isCompensationTestEligible());
    }
    isCompensationTestEligible() {
        return (this.details.bookingStatus === enums_1.CRMBookingStatus.Cancelled &&
            this.details.owedCompensationBooking);
    }
    isZeroCost() {
        return Boolean(this.details.isZeroCostBooking);
    }
    isConfirmed() {
        return this.details.bookingStatus === enums_1.CRMBookingStatus.Confirmed;
    }
    isChangeInProgress() {
        return this.details.bookingStatus === enums_1.CRMBookingStatus.ChangeInProgress;
    }
    isDraft() {
        return this.details.bookingStatus === enums_1.CRMBookingStatus.Draft;
    }
    isCancellationInProgress() {
        var _a;
        return (this.details.bookingStatus === enums_1.CRMBookingStatus.CancellationInProgress &&
            this.details.paymentStatus !== enums_1.CRMPaymentStatus.Refunded &&
            ((_a = this.details.financeTransaction) === null || _a === void 0 ? void 0 : _a.transactionStatus) !==
                enums_1.CRMFinanceTransactionStatus.Recognised);
    }
    isInThePast() {
        const now = dayjs_1.default();
        return dayjs_1.default(this.details.testDate).isBefore(now);
    }
    testIsToday() {
        const today = dayjs_1.default();
        return today.isSame(this.details.testDate, "day");
    }
    isCreatedToday() {
        const today = dayjs_1.default();
        return today.isSame(this.details.createdOn, "day");
    }
    canBeCancelled() {
        return (!this.isCreatedToday() &&
            !this.testIsToday() &&
            !this.isInThePast() &&
            !this.isNSABooking());
    }
    isRefundable() {
        return !this.testIsWithin3WorkingDays();
    }
    canBeRescheduled() {
        return (!this.testIsWithin3WorkingDays() &&
            !this.hasEligibilityBypass() &&
            !this.isNSABooking());
    }
    canBeChanged() {
        return !this.testIsWithin3WorkingDays() && !this.isNSABooking();
    }
    get lastRefundOrRescheduleDate() {
        if (this.testIsToday()) {
            return undefined;
        }
        return this.details.testDateMinus3ClearWorkingDays;
    }
    isNSABooking() {
        if (this.details.nonStandardAccommodation === null ||
            this.details.nonStandardAccommodation === undefined) {
            throw new Error("BookingController::testIsAnNsaBooking: Non standard accommodation flag is missing");
        }
        return this.details.nonStandardAccommodation;
    }
    testIsWithin3WorkingDays() {
        if (this.testIsToday()) {
            return true;
        }
        if (!this.details.testDateMinus3ClearWorkingDays) {
            throw new Error("BookingController::testIsWithin3WorkingDays: Cannot calculate as 3 working days value is missing");
        }
        const today = dayjs_1.default();
        return today.isAfter(this.details.testDateMinus3ClearWorkingDays, "day");
    }
    hasEligibilityBypass() {
        if (this.details.enableEligibilityBypass == null) {
            return false;
        }
        return this.details.enableEligibilityBypass;
    }
}
exports.Booking = Booking;
// Sort compare function
const byTestDateSoonestFirst = (b1, b2) => String(b1.details.testDate) > String(b2.details.testDate) ? 1 : -1;
exports.byTestDateSoonestFirst = byTestDateSoonestFirst;
