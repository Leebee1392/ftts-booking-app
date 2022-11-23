"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsaStatus = exports.Collection = exports.CRMStateCode = exports.CRMTestSupportNeed = exports.CRMCancelReason = exports.CRMEvidenceStatus = exports.CRMZeroCostBookingReason = exports.CRMFinanceTransactionStatus = exports.CRMTransactionType = exports.CRMCalendarName = exports.CRMRemit = exports.CRMPaymentStatus = exports.CRMLicenceValidStatus = exports.CRMTestLanguage = exports.TestEngineTestType = exports.CRMProductNumber = exports.CRMTestType = exports.CRMVoiceOver = exports.CRMAdditionalSupport = exports.CRMPreferredCommunicationMethod = exports.CRMNsaStatus = exports.CRMNsaBookingSlotStatus = exports.CRMGovernmentAgency = exports.CRMBookingStatus = exports.CRMOrigin = exports.CRMGenderCode = exports.CRMPersonType = exports.CRMPeopleTitle = void 0;
var CRMPeopleTitle;
(function (CRMPeopleTitle) {
    CRMPeopleTitle[CRMPeopleTitle["MR"] = 675030000] = "MR";
    CRMPeopleTitle[CRMPeopleTitle["MS"] = 675030001] = "MS";
    CRMPeopleTitle[CRMPeopleTitle["MX"] = 675030002] = "MX";
    CRMPeopleTitle[CRMPeopleTitle["MRS"] = 675030003] = "MRS";
    CRMPeopleTitle[CRMPeopleTitle["MISS"] = 675030004] = "MISS";
    CRMPeopleTitle[CRMPeopleTitle["DR"] = 675030005] = "DR";
})(CRMPeopleTitle = exports.CRMPeopleTitle || (exports.CRMPeopleTitle = {}));
var CRMPersonType;
(function (CRMPersonType) {
    CRMPersonType[CRMPersonType["Candidate"] = 675030000] = "Candidate";
    CRMPersonType[CRMPersonType["IhttcPortalUser"] = 675030001] = "IhttcPortalUser";
    CRMPersonType[CRMPersonType["TrainerBookerPortalUser"] = 675030002] = "TrainerBookerPortalUser";
    CRMPersonType[CRMPersonType["Unknown"] = 675030003] = "Unknown";
    CRMPersonType[CRMPersonType["IhttcCandidate"] = 675030004] = "IhttcCandidate";
    CRMPersonType[CRMPersonType["TncPortalUser"] = 675030005] = "TncPortalUser";
})(CRMPersonType = exports.CRMPersonType || (exports.CRMPersonType = {}));
var CRMGenderCode;
(function (CRMGenderCode) {
    CRMGenderCode[CRMGenderCode["Male"] = 1] = "Male";
    CRMGenderCode[CRMGenderCode["Female"] = 2] = "Female";
    CRMGenderCode[CRMGenderCode["Unknown"] = 3] = "Unknown";
})(CRMGenderCode = exports.CRMGenderCode || (exports.CRMGenderCode = {}));
var CRMOrigin;
(function (CRMOrigin) {
    CRMOrigin[CRMOrigin["CitizenPortal"] = 1] = "CitizenPortal";
    CRMOrigin[CRMOrigin["CustomerServiceCentre"] = 2] = "CustomerServiceCentre";
    CRMOrigin[CRMOrigin["IHTTCPortal"] = 3] = "IHTTCPortal";
    CRMOrigin[CRMOrigin["TrainerBookerPortal"] = 4] = "TrainerBookerPortal";
})(CRMOrigin = exports.CRMOrigin || (exports.CRMOrigin = {}));
var CRMBookingStatus;
(function (CRMBookingStatus) {
    CRMBookingStatus[CRMBookingStatus["Reserved"] = 675030000] = "Reserved";
    CRMBookingStatus[CRMBookingStatus["Confirmed"] = 675030001] = "Confirmed";
    CRMBookingStatus[CRMBookingStatus["CancellationInProgress"] = 675030002] = "CancellationInProgress";
    CRMBookingStatus[CRMBookingStatus["ChangeInProgress"] = 675030003] = "ChangeInProgress";
    CRMBookingStatus[CRMBookingStatus["CompletePassed"] = 675030004] = "CompletePassed";
    CRMBookingStatus[CRMBookingStatus["CompleteFailed"] = 675030005] = "CompleteFailed";
    CRMBookingStatus[CRMBookingStatus["Draft"] = 675030006] = "Draft";
    CRMBookingStatus[CRMBookingStatus["Cancelled"] = 675030008] = "Cancelled";
    CRMBookingStatus[CRMBookingStatus["Unassigned"] = 675030009] = "Unassigned";
    CRMBookingStatus[CRMBookingStatus["Expired"] = 675030010] = "Expired";
    CRMBookingStatus[CRMBookingStatus["Assigned"] = 675030011] = "Assigned";
    CRMBookingStatus[CRMBookingStatus["NoLongerRequired"] = 675030012] = "NoLongerRequired";
    CRMBookingStatus[CRMBookingStatus["Incomplete"] = 675030007] = "Incomplete";
    CRMBookingStatus[CRMBookingStatus["AbandonedNonRecoverable"] = 675030013] = "AbandonedNonRecoverable";
    CRMBookingStatus[CRMBookingStatus["SystemErrorNonRecoverable"] = 675030014] = "SystemErrorNonRecoverable";
})(CRMBookingStatus = exports.CRMBookingStatus || (exports.CRMBookingStatus = {}));
var CRMGovernmentAgency;
(function (CRMGovernmentAgency) {
    CRMGovernmentAgency[CRMGovernmentAgency["Dvsa"] = 0] = "Dvsa";
    CRMGovernmentAgency[CRMGovernmentAgency["Dva"] = 1] = "Dva";
})(CRMGovernmentAgency = exports.CRMGovernmentAgency || (exports.CRMGovernmentAgency = {}));
var CRMNsaBookingSlotStatus;
(function (CRMNsaBookingSlotStatus) {
    CRMNsaBookingSlotStatus[CRMNsaBookingSlotStatus["Offered"] = 675030000] = "Offered";
    CRMNsaBookingSlotStatus[CRMNsaBookingSlotStatus["Reserved"] = 675030001] = "Reserved";
    CRMNsaBookingSlotStatus[CRMNsaBookingSlotStatus["Rejected"] = 675030002] = "Rejected";
    CRMNsaBookingSlotStatus[CRMNsaBookingSlotStatus["UnderReview"] = 675030003] = "UnderReview";
    CRMNsaBookingSlotStatus[CRMNsaBookingSlotStatus["Cancelled"] = 675030004] = "Cancelled";
    CRMNsaBookingSlotStatus[CRMNsaBookingSlotStatus["AwaitingPayment"] = 675030005] = "AwaitingPayment";
})(CRMNsaBookingSlotStatus = exports.CRMNsaBookingSlotStatus || (exports.CRMNsaBookingSlotStatus = {}));
var CRMNsaStatus;
(function (CRMNsaStatus) {
    CRMNsaStatus[CRMNsaStatus["AwaitingCscResponse"] = 675030000] = "AwaitingCscResponse";
    CRMNsaStatus[CRMNsaStatus["AwaitingCandidateResponse"] = 675030001] = "AwaitingCandidateResponse";
    CRMNsaStatus[CRMNsaStatus["AwaitingPartnerResponse"] = 675030003] = "AwaitingPartnerResponse";
    CRMNsaStatus[CRMNsaStatus["AwaitingCandidateInitialReply"] = 675030005] = "AwaitingCandidateInitialReply";
    CRMNsaStatus[CRMNsaStatus["AwaitingCandidateMedicalEvidence"] = 675030006] = "AwaitingCandidateMedicalEvidence";
    CRMNsaStatus[CRMNsaStatus["AwaitingCandidateSlotConfirmation"] = 675030007] = "AwaitingCandidateSlotConfirmation";
    CRMNsaStatus[CRMNsaStatus["EscalatedToNationalOperations"] = 675030002] = "EscalatedToNationalOperations";
    CRMNsaStatus[CRMNsaStatus["EscalatedToTestContent"] = 675030004] = "EscalatedToTestContent";
    CRMNsaStatus[CRMNsaStatus["DuplicationsClosed"] = 675030008] = "DuplicationsClosed";
    CRMNsaStatus[CRMNsaStatus["NoLongerRequired"] = 675030009] = "NoLongerRequired";
    CRMNsaStatus[CRMNsaStatus["StandardTestBooked"] = 675030010] = "StandardTestBooked";
})(CRMNsaStatus = exports.CRMNsaStatus || (exports.CRMNsaStatus = {}));
var CRMPreferredCommunicationMethod;
(function (CRMPreferredCommunicationMethod) {
    CRMPreferredCommunicationMethod[CRMPreferredCommunicationMethod["Email"] = 675030000] = "Email";
    CRMPreferredCommunicationMethod[CRMPreferredCommunicationMethod["Post"] = 675030001] = "Post";
    CRMPreferredCommunicationMethod[CRMPreferredCommunicationMethod["Phone"] = 675030002] = "Phone";
})(CRMPreferredCommunicationMethod = exports.CRMPreferredCommunicationMethod || (exports.CRMPreferredCommunicationMethod = {}));
var CRMAdditionalSupport;
(function (CRMAdditionalSupport) {
    CRMAdditionalSupport[CRMAdditionalSupport["VoiceoverEnglish"] = 675030000] = "VoiceoverEnglish";
    CRMAdditionalSupport[CRMAdditionalSupport["VoiceoverWelsh"] = 675030001] = "VoiceoverWelsh";
    CRMAdditionalSupport[CRMAdditionalSupport["BritishSignLanguage"] = 675030002] = "BritishSignLanguage";
    CRMAdditionalSupport[CRMAdditionalSupport["None"] = 675030003] = "None";
})(CRMAdditionalSupport = exports.CRMAdditionalSupport || (exports.CRMAdditionalSupport = {}));
var CRMVoiceOver;
(function (CRMVoiceOver) {
    CRMVoiceOver[CRMVoiceOver["Albanian"] = 675030000] = "Albanian";
    CRMVoiceOver[CRMVoiceOver["Arabic"] = 675030001] = "Arabic";
    CRMVoiceOver[CRMVoiceOver["Bengali"] = 675030002] = "Bengali";
    CRMVoiceOver[CRMVoiceOver["Cantonese"] = 675030003] = "Cantonese";
    CRMVoiceOver[CRMVoiceOver["Dari"] = 675030004] = "Dari";
    CRMVoiceOver[CRMVoiceOver["English"] = 675030005] = "English";
    CRMVoiceOver[CRMVoiceOver["Farsi"] = 675030006] = "Farsi";
    CRMVoiceOver[CRMVoiceOver["Gujarati"] = 675030007] = "Gujarati";
    CRMVoiceOver[CRMVoiceOver["Hindi"] = 675030008] = "Hindi";
    CRMVoiceOver[CRMVoiceOver["Kashmiri"] = 675030009] = "Kashmiri";
    CRMVoiceOver[CRMVoiceOver["Kurdish"] = 675030010] = "Kurdish";
    CRMVoiceOver[CRMVoiceOver["Mirpuri"] = 675030011] = "Mirpuri";
    CRMVoiceOver[CRMVoiceOver["Polish"] = 675030012] = "Polish";
    CRMVoiceOver[CRMVoiceOver["Portuguese"] = 675030013] = "Portuguese";
    CRMVoiceOver[CRMVoiceOver["Punjabi"] = 675030014] = "Punjabi";
    CRMVoiceOver[CRMVoiceOver["Pushto"] = 675030015] = "Pushto";
    CRMVoiceOver[CRMVoiceOver["Spanish"] = 675030016] = "Spanish";
    CRMVoiceOver[CRMVoiceOver["Tamil"] = 675030017] = "Tamil";
    CRMVoiceOver[CRMVoiceOver["Turkish"] = 675030018] = "Turkish";
    CRMVoiceOver[CRMVoiceOver["Urdu"] = 675030019] = "Urdu";
    CRMVoiceOver[CRMVoiceOver["None"] = 675030020] = "None";
    CRMVoiceOver[CRMVoiceOver["Welsh"] = 675030021] = "Welsh";
})(CRMVoiceOver = exports.CRMVoiceOver || (exports.CRMVoiceOver = {}));
var CRMTestType;
(function (CRMTestType) {
    CRMTestType[CRMTestType["Car"] = 675030000] = "Car";
    CRMTestType[CRMTestType["Motorcycle"] = 675030001] = "Motorcycle";
    CRMTestType[CRMTestType["LGV"] = 675030002] = "LGV";
    CRMTestType[CRMTestType["PCV"] = 675030003] = "PCV";
})(CRMTestType = exports.CRMTestType || (exports.CRMTestType = {}));
var CRMProductNumber;
(function (CRMProductNumber) {
    CRMProductNumber["CAR"] = "1001";
    CRMProductNumber["MOTORCYCLE"] = "2001";
    CRMProductNumber["LGVMC"] = "3001";
    CRMProductNumber["LGVHPT"] = "3002";
    CRMProductNumber["LGVCPC"] = "3003";
    CRMProductNumber["LGVCPCC"] = "3004";
    CRMProductNumber["PCVMC"] = "4001";
    CRMProductNumber["PCVHPT"] = "4002";
    CRMProductNumber["PCVCPC"] = "4003";
    CRMProductNumber["PCVCPCC"] = "4004";
    CRMProductNumber["ADIP1"] = "5001";
    CRMProductNumber["ADIHPT"] = "5002";
    CRMProductNumber["ADIP1DVA"] = "5003";
    CRMProductNumber["ERS"] = "6001";
    CRMProductNumber["AMIP1"] = "7001";
    CRMProductNumber["TAXI"] = "8001";
})(CRMProductNumber = exports.CRMProductNumber || (exports.CRMProductNumber = {}));
var TestEngineTestType;
(function (TestEngineTestType) {
    TestEngineTestType[TestEngineTestType["Car"] = 0] = "Car";
    TestEngineTestType[TestEngineTestType["Motorcycle"] = 2] = "Motorcycle";
})(TestEngineTestType = exports.TestEngineTestType || (exports.TestEngineTestType = {}));
var CRMTestLanguage;
(function (CRMTestLanguage) {
    CRMTestLanguage[CRMTestLanguage["English"] = 1] = "English";
    CRMTestLanguage[CRMTestLanguage["Welsh"] = 2] = "Welsh";
})(CRMTestLanguage = exports.CRMTestLanguage || (exports.CRMTestLanguage = {}));
var CRMLicenceValidStatus;
(function (CRMLicenceValidStatus) {
    CRMLicenceValidStatus[CRMLicenceValidStatus["Valid"] = 1] = "Valid";
    CRMLicenceValidStatus[CRMLicenceValidStatus["Invalid"] = 2] = "Invalid";
})(CRMLicenceValidStatus = exports.CRMLicenceValidStatus || (exports.CRMLicenceValidStatus = {}));
var CRMPaymentStatus;
(function (CRMPaymentStatus) {
    CRMPaymentStatus[CRMPaymentStatus["InProgress"] = 800] = "InProgress";
    CRMPaymentStatus[CRMPaymentStatus["UserCancelled"] = 807] = "UserCancelled";
    CRMPaymentStatus[CRMPaymentStatus["Reallocated"] = 831] = "Reallocated";
    CRMPaymentStatus[CRMPaymentStatus["Adjusted"] = 821] = "Adjusted";
    CRMPaymentStatus[CRMPaymentStatus["Draft"] = 100] = "Draft";
    CRMPaymentStatus[CRMPaymentStatus["Success"] = 801] = "Success";
    CRMPaymentStatus[CRMPaymentStatus["Failure"] = 802] = "Failure";
    CRMPaymentStatus[CRMPaymentStatus["Refunded"] = 809] = "Refunded";
    CRMPaymentStatus[CRMPaymentStatus["Abandoned"] = 834] = "Abandoned";
    CRMPaymentStatus[CRMPaymentStatus["Reversed"] = 675030001] = "Reversed";
    CRMPaymentStatus[CRMPaymentStatus["StatusUnknown"] = 675030004] = "StatusUnknown";
    CRMPaymentStatus[CRMPaymentStatus["CompensationSent"] = 844] = "CompensationSent";
})(CRMPaymentStatus = exports.CRMPaymentStatus || (exports.CRMPaymentStatus = {}));
var CRMRemit;
(function (CRMRemit) {
    CRMRemit[CRMRemit["England"] = 675030000] = "England";
    CRMRemit[CRMRemit["Wales"] = 675030002] = "Wales";
    CRMRemit[CRMRemit["Scotland"] = 675030003] = "Scotland";
    CRMRemit[CRMRemit["NorthernIreland"] = 675030001] = "NorthernIreland";
})(CRMRemit = exports.CRMRemit || (exports.CRMRemit = {}));
var CRMCalendarName;
(function (CRMCalendarName) {
    CRMCalendarName["England"] = "DVSA - England";
    CRMCalendarName["Wales"] = "DVSA - Wales";
    CRMCalendarName["Scotland"] = "DVSA - Scotland";
    CRMCalendarName["NorthernIreland"] = "DVA - NI";
})(CRMCalendarName = exports.CRMCalendarName || (exports.CRMCalendarName = {}));
var CRMTransactionType;
(function (CRMTransactionType) {
    CRMTransactionType[CRMTransactionType["Booking"] = 675030004] = "Booking";
    CRMTransactionType[CRMTransactionType["Refund"] = 675030005] = "Refund";
    CRMTransactionType[CRMTransactionType["Reversal"] = 675030013] = "Reversal";
    CRMTransactionType[CRMTransactionType["PFATopup"] = 675030000] = "PFATopup";
    CRMTransactionType[CRMTransactionType["PFABooking"] = 675030001] = "PFABooking";
    CRMTransactionType[CRMTransactionType["PFAWithdraw"] = 675030002] = "PFAWithdraw";
    CRMTransactionType[CRMTransactionType["PFABookingRefund"] = 675030003] = "PFABookingRefund";
    CRMTransactionType[CRMTransactionType["PFAAdjustment"] = 675030006] = "PFAAdjustment";
    CRMTransactionType[CRMTransactionType["PFAReallocation"] = 675030007] = "PFAReallocation";
    CRMTransactionType[CRMTransactionType["PFAReallocationTopUp"] = 675030008] = "PFAReallocationTopUp";
    CRMTransactionType[CRMTransactionType["PFACompensation"] = 675030011] = "PFACompensation";
    CRMTransactionType[CRMTransactionType["BookingNoPayment"] = 675030012] = "BookingNoPayment";
    CRMTransactionType[CRMTransactionType["PFAReversal"] = 675030009] = "PFAReversal";
})(CRMTransactionType = exports.CRMTransactionType || (exports.CRMTransactionType = {}));
var CRMFinanceTransactionStatus;
(function (CRMFinanceTransactionStatus) {
    CRMFinanceTransactionStatus[CRMFinanceTransactionStatus["Deferred"] = 675030000] = "Deferred";
    CRMFinanceTransactionStatus[CRMFinanceTransactionStatus["Recognised"] = 675030001] = "Recognised";
    CRMFinanceTransactionStatus[CRMFinanceTransactionStatus["Duplicate"] = 675030002] = "Duplicate";
})(CRMFinanceTransactionStatus = exports.CRMFinanceTransactionStatus || (exports.CRMFinanceTransactionStatus = {}));
var CRMZeroCostBookingReason;
(function (CRMZeroCostBookingReason) {
    CRMZeroCostBookingReason[CRMZeroCostBookingReason["EXAMINER"] = 675030000] = "EXAMINER";
    CRMZeroCostBookingReason[CRMZeroCostBookingReason["DISTURBANCE"] = 675030001] = "DISTURBANCE";
    CRMZeroCostBookingReason[CRMZeroCostBookingReason["OTHER"] = 675030002] = "OTHER";
})(CRMZeroCostBookingReason = exports.CRMZeroCostBookingReason || (exports.CRMZeroCostBookingReason = {}));
var CRMEvidenceStatus;
(function (CRMEvidenceStatus) {
    CRMEvidenceStatus[CRMEvidenceStatus["Approved"] = 675030000] = "Approved";
    CRMEvidenceStatus[CRMEvidenceStatus["AwaitingEvidence"] = 675030001] = "AwaitingEvidence";
    CRMEvidenceStatus[CRMEvidenceStatus["Escalated"] = 675030002] = "Escalated";
    CRMEvidenceStatus[CRMEvidenceStatus["Rejected"] = 675030003] = "Rejected";
})(CRMEvidenceStatus = exports.CRMEvidenceStatus || (exports.CRMEvidenceStatus = {}));
var CRMCancelReason;
(function (CRMCancelReason) {
    CRMCancelReason[CRMCancelReason["DVSACancelled"] = 675030007] = "DVSACancelled";
    CRMCancelReason[CRMCancelReason["TestCentreCancelled"] = 675030008] = "TestCentreCancelled";
    CRMCancelReason[CRMCancelReason["TestEngineCancelled"] = 675030009] = "TestEngineCancelled";
    CRMCancelReason[CRMCancelReason["Bereavement"] = 675030000] = "Bereavement";
    CRMCancelReason[CRMCancelReason["Emergency"] = 675030001] = "Emergency";
    CRMCancelReason[CRMCancelReason["Exams"] = 675030002] = "Exams";
    CRMCancelReason[CRMCancelReason["Medical"] = 675030003] = "Medical";
    CRMCancelReason[CRMCancelReason["DateOrTimeNoLongerSuitable"] = 675030004] = "DateOrTimeNoLongerSuitable";
    CRMCancelReason[CRMCancelReason["PreferNotToSay"] = 675030005] = "PreferNotToSay";
    CRMCancelReason[CRMCancelReason["Other"] = 675030006] = "Other";
})(CRMCancelReason = exports.CRMCancelReason || (exports.CRMCancelReason = {}));
var CRMTestSupportNeed;
(function (CRMTestSupportNeed) {
    CRMTestSupportNeed[CRMTestSupportNeed["BSLInterpreter"] = 675030000] = "BSLInterpreter";
    CRMTestSupportNeed[CRMTestSupportNeed["ExtraTime"] = 675030003] = "ExtraTime";
    CRMTestSupportNeed[CRMTestSupportNeed["ExtraTimeWithBreak"] = 675030004] = "ExtraTimeWithBreak";
    CRMTestSupportNeed[CRMTestSupportNeed["ForeignLanguageInterpreter"] = 675030005] = "ForeignLanguageInterpreter";
    CRMTestSupportNeed[CRMTestSupportNeed["HomeTest"] = 675030006] = "HomeTest";
    CRMTestSupportNeed[CRMTestSupportNeed["LipSpeaker"] = 675030007] = "LipSpeaker";
    CRMTestSupportNeed[CRMTestSupportNeed["NonStandardAccommodationRequest"] = 675030008] = "NonStandardAccommodationRequest";
    CRMTestSupportNeed[CRMTestSupportNeed["OralLanguageModifier"] = 675030009] = "OralLanguageModifier";
    CRMTestSupportNeed[CRMTestSupportNeed["OtherSigner"] = 675030010] = "OtherSigner";
    CRMTestSupportNeed[CRMTestSupportNeed["Reader"] = 675030011] = "Reader";
    CRMTestSupportNeed[CRMTestSupportNeed["FamiliarReaderToCandidate"] = 675030012] = "FamiliarReaderToCandidate";
    CRMTestSupportNeed[CRMTestSupportNeed["Reader_Recorder"] = 675030013] = "Reader_Recorder";
    CRMTestSupportNeed[CRMTestSupportNeed["SeperateRoom"] = 675030014] = "SeperateRoom";
    CRMTestSupportNeed[CRMTestSupportNeed["TestInIsolation"] = 675030015] = "TestInIsolation";
    CRMTestSupportNeed[CRMTestSupportNeed["SpecialTestingEquipment"] = 675030016] = "SpecialTestingEquipment";
})(CRMTestSupportNeed = exports.CRMTestSupportNeed || (exports.CRMTestSupportNeed = {}));
var CRMStateCode;
(function (CRMStateCode) {
    CRMStateCode[CRMStateCode["Active"] = 0] = "Active";
    CRMStateCode[CRMStateCode["Inactive"] = 1] = "Inactive";
})(CRMStateCode = exports.CRMStateCode || (exports.CRMStateCode = {}));
var Collection;
(function (Collection) {
    Collection["BOOKING_PRODUCT"] = "ftts_bookingproducts";
    Collection["NSA_BOOKING_SLOTS"] = "ftts_nsabookingslots";
    Collection["LICENCES"] = "ftts_licences";
})(Collection = exports.Collection || (exports.Collection = {}));
var NsaStatus;
(function (NsaStatus) {
    NsaStatus["AwaitingCscResponse"] = "AwaitingCscResponse";
    NsaStatus["AwaitingCandidateResponse"] = "AwaitingCandidateResponse";
    NsaStatus["AwaitingPartnerResponse"] = "AwaitingPartnerResponse";
    NsaStatus["AwaitingCandidateInitialReply"] = "AwaitingCandidateInitialReply";
    NsaStatus["AwaitingCandidateMedicalEvidence"] = "AwaitingCandidateMedicalEvidence";
    NsaStatus["AwaitingCandidateSlotConfirmation"] = "AwaitingCandidateSlotConfirmation";
    NsaStatus["EscalatedToNationalOperations"] = "EscalatedToNationalOperations";
    NsaStatus["EscalatedToTestContent"] = "EscalatedToTestContent";
    NsaStatus["DuplicationsClosed"] = "DuplicationsClosed";
    NsaStatus["NoLongerRequired"] = "NoLongerRequired";
    NsaStatus["StandardTestBooked"] = "StandardTestBooked";
})(NsaStatus = exports.NsaStatus || (exports.NsaStatus = {}));
