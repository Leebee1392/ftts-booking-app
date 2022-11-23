"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestVoiceover = void 0;
const enums_1 = require("./enums");
const enums_2 = require("../services/crm-gateway/enums");
const eligibility_1 = require("./eligibility");
class TestVoiceover {
    static fromCRMVoiceover(crmVoiceOver) {
        return this.CRM_VOICEOVER_MAP.get(crmVoiceOver) || enums_1.Voiceover.NONE;
    }
    static availableOptions(target, testType) {
        if (testType === enums_1.TestType.ERS) {
            return [enums_1.Voiceover.ENGLISH];
        }
        if (target === enums_1.Target.NI) {
            switch (testType) {
                case enums_1.TestType.CAR:
                case enums_1.TestType.MOTORCYCLE:
                    return this.ALL_DVA_VOICEOVER_OPTIONS;
                case enums_1.TestType.ADIP1DVA:
                case enums_1.TestType.AMIP1:
                    return [];
                default:
                    return [enums_1.Voiceover.ENGLISH];
            }
        }
        return this.ALL_DVSA_VOICEOVER_OPTIONS;
    }
    static isAvailable(testType) {
        return !eligibility_1.VOICEOVER_UNAVAILABLE_TEST_TYPES.includes(testType);
    }
}
exports.TestVoiceover = TestVoiceover;
TestVoiceover.ALL_DVA_VOICEOVER_OPTIONS = [
    enums_1.Voiceover.ENGLISH,
    enums_1.Voiceover.TURKISH,
    enums_1.Voiceover.PORTUGUESE,
    enums_1.Voiceover.POLISH,
    enums_1.Voiceover.FARSI,
    enums_1.Voiceover.CANTONESE,
    enums_1.Voiceover.ARABIC,
];
TestVoiceover.ALL_DVSA_VOICEOVER_OPTIONS = [
    enums_1.Voiceover.ENGLISH,
    enums_1.Voiceover.WELSH,
];
TestVoiceover.CRM_VOICEOVER_MAP = new Map([
    [enums_2.CRMVoiceOver.Arabic, enums_1.Voiceover.ARABIC],
    [enums_2.CRMVoiceOver.Cantonese, enums_1.Voiceover.CANTONESE],
    [enums_2.CRMVoiceOver.English, enums_1.Voiceover.ENGLISH],
    [enums_2.CRMVoiceOver.Farsi, enums_1.Voiceover.FARSI],
    [enums_2.CRMVoiceOver.Polish, enums_1.Voiceover.POLISH],
    [enums_2.CRMVoiceOver.Portuguese, enums_1.Voiceover.PORTUGUESE],
    [enums_2.CRMVoiceOver.Turkish, enums_1.Voiceover.TURKISH],
    [enums_2.CRMVoiceOver.Welsh, enums_1.Voiceover.WELSH],
    [enums_2.CRMVoiceOver.None, enums_1.Voiceover.NONE],
]);
