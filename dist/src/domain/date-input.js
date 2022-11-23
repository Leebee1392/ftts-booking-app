"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateInput = exports.tomorrow = exports.today = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_date_1 = require("./utc-date");
const today = () => dayjs_1.default().startOf("day");
exports.today = today;
const tomorrow = () => exports.today().add(1, "day").startOf("day");
exports.tomorrow = tomorrow;
class DateInput {
    constructor(date) {
        this.date = date;
    }
    static get min() {
        return exports.today().add(1, "day").valueOf();
    }
    static get max() {
        return exports.today().add(6, "month").subtract(1, "day").valueOf();
    }
    static split(isoDateString) {
        const [year, month, day] = isoDateString.split("-");
        return { day, month, year };
    }
    static isValid(value, { req }) {
        return DateInput.of(req.body) instanceof DateInput;
    }
    static isValidWithoutCheckingForSameDayOrSixMonthConstraint(value, { req }) {
        return DateInput.of(req.body) instanceof DateInput;
    }
    static of(source) {
        const { day, month, year } = source;
        const dateString = `${day}-${month}-${year}`;
        const date = dayjs_1.default(dateString, DateInput.allowedFormats, true);
        if (!date.isValid()) {
            throw new Error("dateNotValid");
        }
        if (date.isBefore(exports.today())) {
            throw new Error("dateInPast");
        }
        if (date.isSame(exports.today()) || date.isSame(exports.tomorrow())) {
            throw new Error("dateIsTodayOrTomorrow");
        }
        if (date.isAfter(exports.today().add(6, "month").subtract(1, "day"))) {
            throw new Error("dateBeyond6Months");
        }
        return new DateInput(date);
    }
    toISOFormat() {
        return utc_date_1.toISODateString(this.date);
    }
    isAfter(date) {
        return this.date.isAfter(date);
    }
}
exports.DateInput = DateInput;
DateInput.allowedFormats = [
    "DD-MM-YYYY",
    "D-M-YYYY",
    "DD-M-YYYY",
    "D-MM-YYYY",
    "DD-MM-YY",
    "D-M-YY",
    "DD-M-YY",
    "D-MM-YY",
];
