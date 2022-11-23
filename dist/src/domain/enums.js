"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TARGET_LOCALE_MAP = exports.TestSupportNeed = exports.QueueItImplementation = exports.nonStandardSupportTypes = exports.standardSupportTypes = exports.Origin = exports.EvidencePath = exports.SupportType = exports.PreferredLocation = exports.PreferredDay = exports.Voiceover = exports.TCNRegion = exports.TestType = exports.ChangeLocationTimeOptions = exports.Language = exports.YesNo = exports.Context = exports.Locale = exports.Target = exports.existsInEnum = void 0;
const existsInEnum = (enumType) => (value) => Object.values(enumType).includes(value);
exports.existsInEnum = existsInEnum;
var Target;
(function (Target) {
    Target["GB"] = "gb";
    Target["NI"] = "ni";
})(Target = exports.Target || (exports.Target = {}));
var Locale;
(function (Locale) {
    Locale["GB"] = "gb";
    Locale["NI"] = "ni";
    Locale["CY"] = "cy";
})(Locale = exports.Locale || (exports.Locale = {}));
var Context;
(function (Context) {
    Context["CITIZEN"] = "candidate";
    Context["INSTRUCTOR"] = "instructor";
})(Context = exports.Context || (exports.Context = {}));
var YesNo;
(function (YesNo) {
    YesNo["YES"] = "yes";
    YesNo["NO"] = "no";
})(YesNo = exports.YesNo || (exports.YesNo = {}));
var Language;
(function (Language) {
    Language["ENGLISH"] = "english";
    Language["WELSH"] = "welsh";
})(Language = exports.Language || (exports.Language = {}));
var ChangeLocationTimeOptions;
(function (ChangeLocationTimeOptions) {
    ChangeLocationTimeOptions["TIME_ONLY"] = "changeTimeOnlyOption";
    ChangeLocationTimeOptions["TIME_AND_DATE"] = "changeTimeAndDateOption";
    ChangeLocationTimeOptions["LOCATION"] = "changeLocationOption";
})(ChangeLocationTimeOptions = exports.ChangeLocationTimeOptions || (exports.ChangeLocationTimeOptions = {}));
var TestType;
(function (TestType) {
    TestType["ADIHPT"] = "adihpt";
    TestType["ADIP1"] = "adip1";
    TestType["ADIP1DVA"] = "adip1dva";
    TestType["AMIP1"] = "amip1";
    TestType["CAR"] = "car";
    TestType["ERS"] = "ers";
    TestType["LGVCPC"] = "lgvcpc";
    TestType["LGVCPCC"] = "lgvcpcc";
    TestType["LGVHPT"] = "lgvhpt";
    TestType["LGVMC"] = "lgvmc";
    TestType["MOTORCYCLE"] = "motorcycle";
    TestType["PCVCPC"] = "pcvcpc";
    TestType["PCVCPCC"] = "pcvcpcc";
    TestType["PCVHPT"] = "pcvhpt";
    TestType["PCVMC"] = "pcvmc";
    TestType["TAXI"] = "taxi";
})(TestType = exports.TestType || (exports.TestType = {}));
var TCNRegion;
(function (TCNRegion) {
    TCNRegion["A"] = "a";
    TCNRegion["B"] = "b";
    TCNRegion["C"] = "c";
})(TCNRegion = exports.TCNRegion || (exports.TCNRegion = {}));
var Voiceover;
(function (Voiceover) {
    Voiceover["ENGLISH"] = "english";
    Voiceover["WELSH"] = "welsh";
    Voiceover["ARABIC"] = "arabic";
    Voiceover["FARSI"] = "farsi";
    Voiceover["CANTONESE"] = "cantonese";
    Voiceover["TURKISH"] = "turkish";
    Voiceover["POLISH"] = "polish";
    Voiceover["PORTUGUESE"] = "portuguese";
    Voiceover["NONE"] = "none";
})(Voiceover = exports.Voiceover || (exports.Voiceover = {}));
var PreferredDay;
(function (PreferredDay) {
    PreferredDay["ParticularDay"] = "particularDay";
    PreferredDay["DecideLater"] = "decideLater";
})(PreferredDay = exports.PreferredDay || (exports.PreferredDay = {}));
var PreferredLocation;
(function (PreferredLocation) {
    PreferredLocation["ParticularLocation"] = "particularLocation";
    PreferredLocation["DecideLater"] = "decideLater";
})(PreferredLocation = exports.PreferredLocation || (exports.PreferredLocation = {}));
var SupportType;
(function (SupportType) {
    SupportType["ON_SCREEN_BSL"] = "onScreenBsl";
    SupportType["BSL_INTERPRETER"] = "bslInterpreter";
    SupportType["EXTRA_TIME"] = "extraTime";
    SupportType["READING_SUPPORT"] = "readingSupport";
    SupportType["OTHER"] = "other";
    SupportType["TRANSLATOR"] = "translator";
    SupportType["VOICEOVER"] = "voiceover";
    SupportType["NO_SUPPORT_WANTED"] = "noSupportWanted";
    SupportType["NONE"] = "";
})(SupportType = exports.SupportType || (exports.SupportType = {}));
var EvidencePath;
(function (EvidencePath) {
    EvidencePath["EVIDENCE_REQUIRED"] = "evidence-required";
    EvidencePath["EVIDENCE_NOT_REQUIRED"] = "evidence-not-required";
    EvidencePath["EVIDENCE_MAY_BE_REQUIRED"] = "evidence-may-be-required";
    EvidencePath["RETURNING_CANDIDATE"] = "returning-candidate";
})(EvidencePath = exports.EvidencePath || (exports.EvidencePath = {}));
var Origin;
(function (Origin) {
    Origin["CitizenPortal"] = "citizenPortal";
    Origin["CustomerServiceCentre"] = "customerServiceCentre";
    Origin["IHTTCPortal"] = "ihttcPortal";
    Origin["TrainerBookerPortal"] = "trainerBookerPortal";
})(Origin = exports.Origin || (exports.Origin = {}));
exports.standardSupportTypes = [
    SupportType.ON_SCREEN_BSL,
    SupportType.VOICEOVER,
];
exports.nonStandardSupportTypes = [
    SupportType.BSL_INTERPRETER,
    SupportType.TRANSLATOR,
    SupportType.EXTRA_TIME,
    SupportType.READING_SUPPORT,
];
var QueueItImplementation;
(function (QueueItImplementation) {
    QueueItImplementation["KnownUser"] = "server-side";
    QueueItImplementation["JSImplementation"] = "client-side";
    QueueItImplementation["disabled"] = "disabled";
})(QueueItImplementation = exports.QueueItImplementation || (exports.QueueItImplementation = {}));
var TestSupportNeed;
(function (TestSupportNeed) {
    TestSupportNeed["BSLInterpreter"] = "bslInterpreter";
    TestSupportNeed["ExtraTime"] = "extraTime";
    TestSupportNeed["ExtraTimeWithBreak"] = "extraTimeWithBreak";
    TestSupportNeed["ForeignLanguageInterpreter"] = "foreignLanguageInterpreter";
    TestSupportNeed["HomeTest"] = "homeTest";
    TestSupportNeed["LipSpeaker"] = "lipSpeaker";
    TestSupportNeed["NonStandardAccommodationRequest"] = "nonStandardAccommodationRequest";
    TestSupportNeed["OralLanguageModifier"] = "oralLanguageModifier";
    TestSupportNeed["OtherSigner"] = "otherSigner";
    TestSupportNeed["Reader"] = "reader";
    TestSupportNeed["FamiliarReaderToCandidate"] = "familiarReaderToCandidate";
    TestSupportNeed["Reader_Recorder"] = "readerRecorder";
    TestSupportNeed["SeperateRoom"] = "seperateRoom";
    TestSupportNeed["TestInIsolation"] = "testInIsolation";
    TestSupportNeed["SpecialTestingEquipment"] = "specialTestingEquipment";
    TestSupportNeed["NoSupport"] = "noSupport";
})(TestSupportNeed = exports.TestSupportNeed || (exports.TestSupportNeed = {}));
exports.TARGET_LOCALE_MAP = new Map([
    [Target.GB, [Locale.GB, Locale.CY]],
    [Target.NI, [Locale.NI]],
]);
