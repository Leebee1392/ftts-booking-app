"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isZeroCostTest = exports.behaviouralMarkerLabel = exports.hasBehaviouralMarkerForTest = exports.isInstructorBookable = exports.isBookable = exports.VOICEOVER_UNAVAILABLE_TEST_TYPES = exports.INSTRUCTOR_TEST_TYPES = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const enums_1 = require("./enums");
const NON_BOOKABLE_TEST_TYPES = [
    enums_1.TestType.ADIP1,
    enums_1.TestType.ADIHPT,
    enums_1.TestType.AMIP1,
    enums_1.TestType.ERS,
];
const DVA_ONLY_TEST_TYPES = [enums_1.TestType.TAXI, enums_1.TestType.LGVCPCC, enums_1.TestType.PCVCPCC];
exports.INSTRUCTOR_TEST_TYPES = [
    enums_1.TestType.ADIP1,
    enums_1.TestType.ADIHPT,
    enums_1.TestType.ERS,
    enums_1.TestType.ADIP1DVA,
    enums_1.TestType.AMIP1,
];
exports.VOICEOVER_UNAVAILABLE_TEST_TYPES = [
    enums_1.TestType.ADIP1DVA,
    enums_1.TestType.AMIP1,
];
const ZERO_COST_TEST_TYPES = [enums_1.TestType.ADIP1DVA, enums_1.TestType.AMIP1];
/**
 * Returns true if eligibility item is:
 * - eligible
 * - not one of the test types that can't be booked online
 * - if in target GB, not one of the test types that are DVA only
 * - if eligible from date is before today plus 6 months
 * - if eligible to date is after today
 */
const isBookable = (eligibility, target) => eligibility.eligible &&
    !NON_BOOKABLE_TEST_TYPES.includes(eligibility.testType) &&
    !(target === enums_1.Target.GB && DVA_ONLY_TEST_TYPES.includes(eligibility.testType)) &&
    dayjs_1.default(eligibility.eligibleFrom).isBefore(dayjs_1.default().add(6, "months")) &&
    dayjs_1.default(eligibility.eligibleTo).isAfter(dayjs_1.default());
exports.isBookable = isBookable;
const isInstructorBookable = (eligibility, target) => eligibility.eligible &&
    exports.INSTRUCTOR_TEST_TYPES.includes(eligibility.testType) &&
    !(target === enums_1.Target.GB && DVA_ONLY_TEST_TYPES.includes(eligibility.testType)) &&
    validateEligibleDates(eligibility);
exports.isInstructorBookable = isInstructorBookable;
const validateEligibleDates = (eligibility) => {
    if (eligibility.testType === enums_1.TestType.ERS) {
        return true;
    }
    return (dayjs_1.default(eligibility.eligibleFrom).isBefore(dayjs_1.default().add(6, "months")) &&
        dayjs_1.default(eligibility.eligibleTo).isAfter(dayjs_1.default()));
};
const hasBehaviouralMarkerForTest = (testDate, behaviouralMarker, behaviouralMarkerExpiryDate) => {
    if (!behaviouralMarker) {
        return false;
    }
    return dayjs_1.default(testDate).isBefore(dayjs_1.default(behaviouralMarkerExpiryDate));
};
exports.hasBehaviouralMarkerForTest = hasBehaviouralMarkerForTest;
exports.behaviouralMarkerLabel = "Candidate has a behavioural marker";
const isZeroCostTest = (testType) => ZERO_COST_TEST_TYPES.includes(testType);
exports.isZeroCostTest = isZeroCostTest;
