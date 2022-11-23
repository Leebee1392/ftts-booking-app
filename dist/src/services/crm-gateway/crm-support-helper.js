"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRMSupportHelper = void 0;
const enums_1 = require("../../domain/enums");
const enums_2 = require("./enums");
class CRMSupportHelper {
    constructor(supportTypes, customSupport) {
        this.supportTypes = supportTypes;
        this.customSupport = customSupport;
    }
    static preferredCommunicationMethod(telephone) {
        return telephone
            ? enums_2.CRMPreferredCommunicationMethod.Phone
            : enums_2.CRMPreferredCommunicationMethod.Email;
    }
    static getPreferredDayOrLocation(preferredOption, preferredText) {
        return (preferredOption === enums_1.PreferredDay.ParticularDay ||
            preferredOption === enums_1.PreferredLocation.ParticularLocation) &&
            preferredText
            ? preferredText
            : undefined;
    }
    static getTranslator(supportTypes, translator) {
        return supportTypes.includes(enums_1.SupportType.TRANSLATOR)
            ? translator
            : undefined;
    }
    static isVoicemail(telephone, voicemail) {
        if (telephone) {
            return voicemail;
        }
        return undefined;
    }
    toString(translatorLanguage) {
        if (!this.supportTypes.includes(enums_1.SupportType.OTHER)) {
            this.customSupport = "";
        }
        return this.supportTypes && this.supportTypes.length !== 0
            ? `${this.deconstructArray(translatorLanguage)}\n\n${this.customSupport || ""}`
            : "";
    }
    deconstructArray(translatorLanguage) {
        return this.supportTypes
            .map((supportType) => {
            let label = CRMSupportHelper.supportTypeMap.get(supportType);
            if (supportType === enums_1.SupportType.TRANSLATOR) {
                label = `${label} (${translatorLanguage})`;
            }
            return `- ${label}`;
        })
            .join("\n");
    }
}
exports.CRMSupportHelper = CRMSupportHelper;
CRMSupportHelper.supportTypeMap = new Map([
    [enums_1.SupportType.BSL_INTERPRETER, "Sign language (interpreter)"],
    [enums_1.SupportType.EXTRA_TIME, "Extra time"],
    [enums_1.SupportType.ON_SCREEN_BSL, "Sign language (on-screen)"],
    [enums_1.SupportType.OTHER, "Other"],
    [enums_1.SupportType.READING_SUPPORT, "Reading support with answer entry"],
    [enums_1.SupportType.TRANSLATOR, "Translator"],
    [enums_1.SupportType.VOICEOVER, "Voiceover"],
]);
