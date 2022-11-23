"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineEvidenceRoute = exports.isDeafCandidate = void 0;
const enums_1 = require("../domain/enums");
const isDeafCandidate = (supportTypes) => supportTypes.includes(enums_1.SupportType.ON_SCREEN_BSL) ||
    supportTypes.includes(enums_1.SupportType.BSL_INTERPRETER);
exports.isDeafCandidate = isDeafCandidate;
const isEvidenceRequired = (supportTypes) => {
    if (!supportTypes.includes(enums_1.SupportType.EXTRA_TIME) &&
        !supportTypes.includes(enums_1.SupportType.READING_SUPPORT)) {
        return false;
    }
    // Exception for deaf candidates
    if (exports.isDeafCandidate(supportTypes) &&
        supportTypes.includes(enums_1.SupportType.EXTRA_TIME) &&
        !supportTypes.includes(enums_1.SupportType.READING_SUPPORT)) {
        return false;
    }
    return true;
};
const determineEvidenceRoute = (supportTypes, hasSupportNeedsInCRM) => {
    if (hasSupportNeedsInCRM) {
        return enums_1.EvidencePath.RETURNING_CANDIDATE;
    }
    if (isEvidenceRequired(supportTypes))
        return enums_1.EvidencePath.EVIDENCE_REQUIRED;
    if (supportTypes.includes(enums_1.SupportType.OTHER))
        return enums_1.EvidencePath.EVIDENCE_MAY_BE_REQUIRED;
    return enums_1.EvidencePath.EVIDENCE_NOT_REQUIRED;
};
exports.determineEvidenceRoute = determineEvidenceRoute;
