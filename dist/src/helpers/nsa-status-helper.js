"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCRMNsaStatusToNSAStatus = void 0;
const enums_1 = require("../services/crm-gateway/enums");
function mapCRMNsaStatusToNSAStatus(CrmNsaStatus) {
    switch (CrmNsaStatus) {
        case enums_1.CRMNsaStatus.AwaitingCandidateInitialReply:
            return enums_1.NsaStatus.AwaitingCandidateInitialReply;
        case enums_1.CRMNsaStatus.AwaitingCandidateMedicalEvidence:
            return enums_1.NsaStatus.AwaitingCandidateMedicalEvidence;
        case enums_1.CRMNsaStatus.AwaitingCandidateResponse:
            return enums_1.NsaStatus.AwaitingCandidateResponse;
        case enums_1.CRMNsaStatus.AwaitingCandidateSlotConfirmation:
            return enums_1.NsaStatus.AwaitingCandidateSlotConfirmation;
        case enums_1.CRMNsaStatus.AwaitingCscResponse:
            return enums_1.NsaStatus.AwaitingCscResponse;
        case enums_1.CRMNsaStatus.AwaitingPartnerResponse:
            return enums_1.NsaStatus.AwaitingPartnerResponse;
        case enums_1.CRMNsaStatus.DuplicationsClosed:
            return enums_1.NsaStatus.DuplicationsClosed;
        case enums_1.CRMNsaStatus.EscalatedToNationalOperations:
            return enums_1.NsaStatus.EscalatedToNationalOperations;
        case enums_1.CRMNsaStatus.EscalatedToTestContent:
            return enums_1.NsaStatus.EscalatedToTestContent;
        case enums_1.CRMNsaStatus.NoLongerRequired:
            return enums_1.NsaStatus.NoLongerRequired;
        default:
            return enums_1.NsaStatus.StandardTestBooked;
    }
}
exports.mapCRMNsaStatusToNSAStatus = mapCRMNsaStatusToNSAStatus;
