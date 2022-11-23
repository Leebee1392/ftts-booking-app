"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bslIsAvailable = void 0;
const eligibility_1 = require("./eligibility");
const enums_1 = require("./enums");
const bslIsAvailable = (testType) => !eligibility_1.INSTRUCTOR_TEST_TYPES.includes(testType) &&
    (testType === enums_1.TestType.CAR || testType === enums_1.TestType.MOTORCYCLE);
exports.bslIsAvailable = bslIsAvailable;
