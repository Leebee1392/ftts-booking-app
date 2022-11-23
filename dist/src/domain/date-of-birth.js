"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateOfBirth = void 0;
const logger_1 = require("../helpers/logger");
class DateOfBirth {
    static isValid(dobDay, { req }) {
        const { dobMonth, dobYear } = req.body;
        const dateString = `${dobDay}-${dobMonth}-${dobYear}`;
        if ((dobDay === null || dobDay === void 0 ? void 0 : dobDay.trim()) === "" ||
            (dobMonth === null || dobMonth === void 0 ? void 0 : dobMonth.trim()) === "" ||
            (dobYear === null || dobYear === void 0 ? void 0 : dobYear.trim()) === "") {
            throw new Error("date of birth is blank");
        }
        // Allows the following formats DD-MM-YYY DD-M-YYYY D-MM-YYYY D-M-YYYY
        if (!/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateString)) {
            logger_1.logger.debug("DateOfBirth::isValid: Format of date of birth is incorrect", {
                dayLength: dobDay === null || dobDay === void 0 ? void 0 : dobDay.length,
                monthLength: dobMonth === null || dobMonth === void 0 ? void 0 : dobMonth.length,
                yearLength: dobYear === null || dobYear === void 0 ? void 0 : dobYear.length,
            });
            throw new Error("format of date of birth is incorrect");
        }
        const day = parseInt(dobDay, 10);
        const month = parseInt(dobMonth, 10);
        const year = parseInt(dobYear, 10);
        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month < 1 || month > 12) {
            logger_1.logger.debug("DateOfBirth::isValid: Range of month/year is invalid", {
                dayLength: dobDay === null || dobDay === void 0 ? void 0 : dobDay.length,
                monthLength: dobMonth === null || dobMonth === void 0 ? void 0 : dobMonth.length,
                yearLength: dobYear === null || dobYear === void 0 ? void 0 : dobYear.length,
            });
            throw new Error("date of birth range month/year is invalid");
        }
        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        // Adjust for leap years
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }
        // Check the range of the day
        const dayRangeValid = day > 0 && day <= monthLength[month - 1];
        if (!dayRangeValid) {
            logger_1.logger.warn("DateOfBirth::isValid: Day range is invalid", {
                dayLength: dobDay === null || dobDay === void 0 ? void 0 : dobDay.length,
                monthLength: dobMonth === null || dobMonth === void 0 ? void 0 : dobMonth.length,
                yearLength: dobYear === null || dobYear === void 0 ? void 0 : dobYear.length,
            });
            throw new Error("date of birth day range is invalid");
        }
        return dayRangeValid;
    }
}
exports.DateOfBirth = DateOfBirth;
