"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtcDate = exports.toISODateString = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const logger_1 = require("../helpers/logger");
const toISODateString = (date) => {
    const dateDayjs = typeof date === "string" ? dayjs_1.default(date).tz() : date;
    return dateDayjs.format("YYYY-MM-DD");
};
exports.toISODateString = toISODateString;
class UtcDate {
    constructor(value) {
        this.value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0));
    }
    static of(value) {
        if (value === undefined || Number.isNaN(Date.parse(value))) {
            throw new Error(`"${value}" is not a valid Date`);
        }
        return new UtcDate(new Date(value));
    }
    static isValidIsoTimeStamp(date) {
        try {
            return dayjs_1.default(date).toISOString() === date;
        }
        catch (exception) {
            logger_1.logger.warn("UtcDate::isValidIsoTimeStamp: No valid ISO string format");
            return false;
        }
    }
    static isValidIsoDateString(date) {
        return dayjs_1.default(date, "YYYY-MM-DD", true).isValid();
    }
    static today() {
        return new UtcDate(new Date());
    }
    toIsoTimeStamp() {
        return this.value.toISOString();
    }
    toIsoDate() {
        return dayjs_1.default(this.value).format("YYYY-MM-DD");
    }
    toDateString() {
        return this.value.toDateString();
    }
    inThePast() {
        return this.value < UtcDate.today().value;
    }
    before(other) {
        return this.value < other.value;
    }
    map(func) {
        return func(this.value);
    }
    nextDay() {
        return this.map(toNextDay);
    }
    equals(other) {
        return this.value.getTime() === other.value.getTime();
    }
    // Adapted from https://github.com/moment/moment/issues/1947
    subtractBusinessDays(subtrahend) {
        const clone = new Date(this.value.valueOf());
        const numberOfFullDays = subtrahend + 1;
        const increment = numberOfFullDays / Math.abs(numberOfFullDays);
        clone.setDate(clone.getDate() -
            Math.floor(Math.abs(numberOfFullDays) / 5) * 7 * increment);
        let remaining = numberOfFullDays % 5;
        while (remaining !== 0) {
            clone.setDate(clone.getDate() - increment);
            if (!isSaturdayOrSunday(clone)) {
                remaining -= increment;
            }
        }
        return new UtcDate(clone);
    }
}
exports.UtcDate = UtcDate;
function isSaturdayOrSunday(date) {
    return date.getDay() % 6 === 0;
}
const toNextDay = (v) => {
    const nextDay = new Date(v.getFullYear(), v.getMonth(), v.getDate() + 1);
    return new UtcDate(nextDay);
};
