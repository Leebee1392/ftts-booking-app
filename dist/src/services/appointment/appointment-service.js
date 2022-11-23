"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const scheduling_gateway_1 = require("../scheduling/scheduling-gateway");
const utc_date_1 = require("../../domain/utc-date");
const logger_1 = require("../../helpers/logger");
class AppointmentService {
    constructor(scheduling = scheduling_gateway_1.SchedulingGateway.getInstance()) {
        this.scheduling = scheduling;
    }
    async getSlots(selectedDate, selectedCentre, testType, testEligibility, preferredDate) {
        const dateFrom = this.calculateDateFrom(selectedDate, testEligibility === null || testEligibility === void 0 ? void 0 : testEligibility.eligibleFrom);
        const dateTo = this.calculateDateTo(selectedDate, testEligibility === null || testEligibility === void 0 ? void 0 : testEligibility.eligibleTo);
        if (dateFrom > dateTo) {
            logger_1.logger.debug("AppointmentService::getSlots:dateFrom>dateTo");
            return { slotsByDate: {} };
        }
        const slots = await this.scheduling.availableSlots(dateFrom, dateTo, selectedCentre, testType, preferredDate);
        return {
            slotsByDate: this.groupSlotsByDate(slots, dateFrom, dateTo),
            kpiIdentifiers: this.getKpiIdentifiers(slots, preferredDate),
        };
    }
    getWeekViewDatesDesktop(selectedDate) {
        const startOfWeek = selectedDate.startOf("isoWeek");
        const endOfWeek = selectedDate.endOf("isoWeek");
        return this.getDatesBetween(startOfWeek, endOfWeek).map(utc_date_1.toISODateString);
    }
    getWeekViewDatesMobile(selectedDate, startOfWeek, endOfWeek) {
        const dayBefore = selectedDate.subtract(1, "day");
        const dayAfter = selectedDate.add(1, "day");
        if (selectedDate.isSame(dayjs_1.default(startOfWeek).tz(), "date")) {
            const twoDaysAfter = selectedDate.add(2, "day");
            return [selectedDate, dayAfter, twoDaysAfter].map(utc_date_1.toISODateString);
        }
        if (selectedDate.isSame(dayjs_1.default(endOfWeek).tz(), "date")) {
            const twoDaysBefore = selectedDate.subtract(2, "day");
            return [twoDaysBefore, dayBefore, selectedDate].map(utc_date_1.toISODateString);
        }
        return [dayBefore, selectedDate, dayAfter].map(utc_date_1.toISODateString);
    }
    getPreviousDateMobile(selectedDate) {
        const startOfWeekDiff = selectedDate.diff(selectedDate.startOf("week"), "day");
        if (startOfWeekDiff <= 2) {
            return utc_date_1.toISODateString(selectedDate.subtract(2, "day"));
        }
        return utc_date_1.toISODateString(selectedDate.subtract(3, "day"));
    }
    getNextDateMobile(selectedDate) {
        const endOfWeekDiff = selectedDate.diff(selectedDate.endOf("week"), "day");
        if (endOfWeekDiff >= -2) {
            return utc_date_1.toISODateString(selectedDate.add(2, "day"));
        }
        return utc_date_1.toISODateString(selectedDate.add(3, "day"));
    }
    calculateDateFrom(selectedDate, eligibleFromDate) {
        const startOfWeek = selectedDate.startOf("isoWeek");
        const today = dayjs_1.default().tz().startOf("day");
        const dayAfterTomorrow = today.add(2, "day");
        let earliestAvailableDate = dayjs_1.default.max(startOfWeek, dayAfterTomorrow);
        if (eligibleFromDate) {
            earliestAvailableDate = dayjs_1.default.max(earliestAvailableDate, dayjs_1.default(eligibleFromDate).tz());
        }
        return utc_date_1.toISODateString(earliestAvailableDate);
    }
    calculateDateTo(selectedDate, eligibleToDate) {
        const endOfWeek = selectedDate.endOf("isoWeek");
        const today = dayjs_1.default().tz().startOf("day");
        const todayPlusSixMonths = today.add(6, "month").subtract(1, "day");
        let latestAvailableDate = dayjs_1.default.min(endOfWeek, todayPlusSixMonths);
        if (eligibleToDate) {
            latestAvailableDate = dayjs_1.default.min(latestAvailableDate, dayjs_1.default(eligibleToDate).tz());
        }
        return utc_date_1.toISODateString(latestAvailableDate);
    }
    groupSlotsByDate(slots, dateFrom, dateTo) {
        const slotsByDate = {};
        let currentDate = dayjs_1.default.tz(dateFrom);
        while (!currentDate.isAfter(dayjs_1.default(dateTo).tz(), "date")) {
            const currentDateIsoString = utc_date_1.toISODateString(currentDate);
            const slotsOnDate = slots.filter((slot) => utc_date_1.toISODateString(slot.startDateTime) === currentDateIsoString);
            // eslint-disable-next-line security/detect-object-injection
            slotsByDate[currentDateIsoString] = slotsOnDate;
            currentDate = currentDate.add(1, "day");
        }
        return slotsByDate;
    }
    getKpiIdentifiers(slots, preferredDate) {
        let kpiIdentifiers;
        if (preferredDate && slots && slots[0]) {
            kpiIdentifiers = {
                dateAvailableOnOrBeforePreferredDate: slots[0].dateAvailableOnOrBeforePreferredDate,
                dateAvailableOnOrAfterPreferredDate: slots[0].dateAvailableOnOrAfterPreferredDate,
                dateAvailableOnOrAfterToday: slots[0].dateAvailableOnOrAfterToday,
            };
        }
        return kpiIdentifiers;
    }
    getDatesBetween(startDate, endDate) {
        let currentDate = startDate;
        const dates = [];
        while (currentDate.isBefore(endDate)) {
            dates.push(currentDate);
            currentDate = currentDate.add(1, "day");
        }
        return dates;
    }
}
exports.AppointmentService = AppointmentService;
