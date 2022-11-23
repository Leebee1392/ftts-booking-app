"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLanguage = void 0;
const language_1 = require("../helpers/language");
const enums_1 = require("./enums");
const enums_2 = require("../services/crm-gateway/enums");
class TestLanguage {
    constructor(testLanguage) {
        this.testLanguage = testLanguage.toLowerCase();
    }
    static from(testLanguage) {
        if (!testLanguage || !this.isAvailableLanguage(testLanguage)) {
            throw new Error(language_1.translate("testLanguage.validationError"));
        }
        return new TestLanguage(testLanguage);
    }
    static fromCRMTestLanguage(crmTestLanguage) {
        const testLanguage = this.CRM_TEST_LANGUAGE_MAP.get(crmTestLanguage) || "";
        return this.from(testLanguage);
    }
    static isAvailableLanguage(testLanguage) {
        if (testLanguage) {
            return TestLanguage.LANGUAGES.has(testLanguage.toLowerCase());
        }
        return false;
    }
    static isValid(testLanguage) {
        return TestLanguage.from(testLanguage) instanceof TestLanguage;
    }
    static availableLanguages() {
        return new Map(TestLanguage.LANGUAGES);
    }
    toString() {
        if (TestLanguage.isValid(this.testLanguage)) {
            return language_1.translate(`generalContent.language.${this.testLanguage}`);
        }
        return "";
    }
    key() {
        return this.testLanguage;
    }
    toSummaryString() {
        return TestLanguage.PREFIX + this.toString();
    }
}
exports.TestLanguage = TestLanguage;
TestLanguage.canChangeTestLanguage = (target, testType) => !(target === enums_1.Target.NI || testType === enums_1.TestType.ERS);
TestLanguage.PREFIX = "Language: ";
TestLanguage.LANGUAGES = new Map([
    [enums_1.Language.ENGLISH, "English"],
    [enums_1.Language.WELSH, "Cymraeg (Welsh)"],
]);
TestLanguage.CRM_TEST_LANGUAGE_MAP = new Map([
    [enums_2.CRMTestLanguage.English, enums_1.Language.ENGLISH],
    [enums_2.CRMTestLanguage.Welsh, enums_1.Language.WELSH],
]);
