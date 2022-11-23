"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSupportTypeOptions = exports.removeInvalidOptions = exports.getInvalidOptions = exports.isOnlyCustomSupportSelected = exports.isOnlyStandardSupportSelected = exports.isNonStandardSupportSelected = exports.canShowVoiceoverChangeButton = exports.canShowBslChangeButton = exports.canChangeVoiceover = exports.canChangeBsl = void 0;
const bsl_1 = require("../domain/bsl");
const enums_1 = require("../domain/enums");
const language_1 = require("./language");
const canChangeBsl = (voiceover) => voiceover === undefined || voiceover === enums_1.Voiceover.NONE;
exports.canChangeBsl = canChangeBsl;
const canChangeVoiceover = (bsl) => !bsl;
exports.canChangeVoiceover = canChangeVoiceover;
const canShowBslChangeButton = (bsl, voiceover) => {
    const canChangeBslOption = exports.canChangeBsl(voiceover);
    const canChangeVoiceoverOption = exports.canChangeVoiceover(bsl);
    return (canChangeBslOption || (!canChangeBslOption && !canChangeVoiceoverOption));
};
exports.canShowBslChangeButton = canShowBslChangeButton;
const canShowVoiceoverChangeButton = (voiceover, bsl) => {
    const canChangeVoiceoverOption = exports.canChangeVoiceover(bsl);
    const canChangeBslOption = exports.canChangeBsl(voiceover);
    return (canChangeVoiceoverOption ||
        (!canChangeBslOption && !canChangeVoiceoverOption));
};
exports.canShowVoiceoverChangeButton = canShowVoiceoverChangeButton;
const isNonStandardSupportSelected = (selectedSupportTypes) => selectedSupportTypes.some((supportType) => enums_1.nonStandardSupportTypes.includes(supportType));
exports.isNonStandardSupportSelected = isNonStandardSupportSelected;
const isOnlyStandardSupportSelected = (selectedSupportTypes) => !selectedSupportTypes.some((supportType) => enums_1.nonStandardSupportTypes.includes(supportType) ||
    supportType === enums_1.SupportType.OTHER);
exports.isOnlyStandardSupportSelected = isOnlyStandardSupportSelected;
const isOnlyCustomSupportSelected = (selectedSupportTypes) => selectedSupportTypes.includes(enums_1.SupportType.OTHER) &&
    selectedSupportTypes.length === 1;
exports.isOnlyCustomSupportSelected = isOnlyCustomSupportSelected;
const getInvalidOptions = (testType, target) => {
    const invalidOptions = [];
    if (target === enums_1.Target.GB) {
        // Remove translator option as it is NI specific
        invalidOptions.push(enums_1.SupportType.TRANSLATOR);
        if ([enums_1.TestType.LGVHPT, enums_1.TestType.PCVHPT, enums_1.TestType.ADIHPT].includes(testType)) {
            invalidOptions.push(enums_1.SupportType.EXTRA_TIME);
            invalidOptions.push(enums_1.SupportType.BSL_INTERPRETER);
        }
    }
    else if (target === enums_1.Target.NI) {
        if ([enums_1.TestType.LGVHPT, enums_1.TestType.PCVHPT].includes(testType)) {
            invalidOptions.push(enums_1.SupportType.EXTRA_TIME);
            invalidOptions.push(enums_1.SupportType.BSL_INTERPRETER);
        }
    }
    if (!bsl_1.bslIsAvailable(testType)) {
        invalidOptions.push(enums_1.SupportType.ON_SCREEN_BSL);
    }
    return invalidOptions;
};
exports.getInvalidOptions = getInvalidOptions;
const removeInvalidOptions = (supportTypeOptions, req) => {
    var _a;
    const testType = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.testType;
    const { target } = req.session;
    exports.getInvalidOptions(testType, target).forEach((invalidOption) => {
        supportTypeOptions.delete(invalidOption);
    });
};
exports.removeInvalidOptions = removeInvalidOptions;
const toSupportTypeOptions = (supportTypes) => {
    const supportTypeOptions = new Map();
    supportTypes.forEach((val) => {
        supportTypeOptions.set(val, {
            attributes: {
                "data-automation-id": `support-${val}`,
            },
            checked: false,
            value: val,
            text: language_1.translate(`selectSupportType.${val}`),
        });
    });
    return supportTypeOptions;
};
exports.toSupportTypeOptions = toSupportTypeOptions;
