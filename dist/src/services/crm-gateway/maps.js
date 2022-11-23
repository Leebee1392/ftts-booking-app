"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromCRMOrigin = exports.fromCRMProductNumber = exports.toCRMProductNumber = exports.toTestEngineTestType = exports.fromCRMTestType = exports.toCRMTestType = void 0;
const enums_1 = require("../../domain/enums");
const enums_2 = require("./enums");
const invertMap = (map) => new Map(Array.from(map, (e) => [e[1], e[0]]));
const toCRMTestType = (testType) => TEST_TYPE_TO_CRM_TEST_TYPE.get(testType);
exports.toCRMTestType = toCRMTestType;
const fromCRMTestType = (crmTestType) => CRM_TEST_TYPE_TO_TEST_TYPE.get(crmTestType);
exports.fromCRMTestType = fromCRMTestType;
const toTestEngineTestType = (testType) => {
    const crmTestType = exports.toCRMTestType(testType);
    return CRM_TEST_TYPE_TO_TEST_ENGINE_TEST_TYPE.get(crmTestType);
};
exports.toTestEngineTestType = toTestEngineTestType;
const toCRMProductNumber = (testType) => TEST_TYPE_TO_CRM_PRODUCT_NUMBER.get(testType);
exports.toCRMProductNumber = toCRMProductNumber;
const fromCRMProductNumber = (crmProductNumber) => CRM_PRODUCT_NUMBER_TO_TEST_TYPE.get(crmProductNumber);
exports.fromCRMProductNumber = fromCRMProductNumber;
const fromCRMOrigin = (crmOrigin) => CRM_ORIGIN_TO_ORIGIN.get(crmOrigin);
exports.fromCRMOrigin = fromCRMOrigin;
const TEST_TYPE_TO_CRM_TEST_TYPE = new Map([
    [enums_1.TestType.CAR, enums_2.CRMTestType.Car],
    [enums_1.TestType.MOTORCYCLE, enums_2.CRMTestType.Motorcycle],
]);
const CRM_TEST_TYPE_TO_TEST_TYPE = invertMap(TEST_TYPE_TO_CRM_TEST_TYPE);
const CRM_TEST_TYPE_TO_TEST_ENGINE_TEST_TYPE = new Map([
    [enums_2.CRMTestType.Car, enums_2.TestEngineTestType.Car],
    [enums_2.CRMTestType.Motorcycle, enums_2.TestEngineTestType.Motorcycle],
]);
const CRM_ORIGIN_TO_ORIGIN = new Map([
    [enums_2.CRMOrigin.CitizenPortal, enums_1.Origin.CitizenPortal],
    [enums_2.CRMOrigin.CustomerServiceCentre, enums_1.Origin.CustomerServiceCentre],
    [enums_2.CRMOrigin.IHTTCPortal, enums_1.Origin.IHTTCPortal],
    [enums_2.CRMOrigin.TrainerBookerPortal, enums_1.Origin.TrainerBookerPortal],
]);
const TEST_TYPE_TO_CRM_PRODUCT_NUMBER = new Map([
    [enums_1.TestType.CAR, enums_2.CRMProductNumber.CAR],
    [enums_1.TestType.MOTORCYCLE, enums_2.CRMProductNumber.MOTORCYCLE],
    [enums_1.TestType.LGVMC, enums_2.CRMProductNumber.LGVMC],
    [enums_1.TestType.LGVHPT, enums_2.CRMProductNumber.LGVHPT],
    [enums_1.TestType.LGVCPC, enums_2.CRMProductNumber.LGVCPC],
    [enums_1.TestType.LGVCPCC, enums_2.CRMProductNumber.LGVCPCC],
    [enums_1.TestType.PCVMC, enums_2.CRMProductNumber.PCVMC],
    [enums_1.TestType.PCVHPT, enums_2.CRMProductNumber.PCVHPT],
    [enums_1.TestType.PCVCPC, enums_2.CRMProductNumber.PCVCPC],
    [enums_1.TestType.PCVCPCC, enums_2.CRMProductNumber.PCVCPCC],
    [enums_1.TestType.ADIP1, enums_2.CRMProductNumber.ADIP1],
    [enums_1.TestType.ADIHPT, enums_2.CRMProductNumber.ADIHPT],
    [enums_1.TestType.ERS, enums_2.CRMProductNumber.ERS],
    [enums_1.TestType.AMIP1, enums_2.CRMProductNumber.AMIP1],
    [enums_1.TestType.TAXI, enums_2.CRMProductNumber.TAXI],
    [enums_1.TestType.ADIP1DVA, enums_2.CRMProductNumber.ADIP1DVA],
]);
const CRM_PRODUCT_NUMBER_TO_TEST_TYPE = invertMap(TEST_TYPE_TO_CRM_PRODUCT_NUMBER);
