import { EvidencePath, SupportType } from "../domain/enums";

export const isDeafCandidate = (supportTypes: SupportType[]): boolean =>
  supportTypes.includes(SupportType.ON_SCREEN_BSL) ||
  supportTypes.includes(SupportType.BSL_INTERPRETER);

const isEvidenceRequired = (supportTypes: SupportType[]): boolean => {
  if (
    !supportTypes.includes(SupportType.EXTRA_TIME) &&
    !supportTypes.includes(SupportType.READING_SUPPORT)
  ) {
    return false;
  }

  // Exception for deaf candidates
  if (
    isDeafCandidate(supportTypes) &&
    supportTypes.includes(SupportType.EXTRA_TIME) &&
    !supportTypes.includes(SupportType.READING_SUPPORT)
  ) {
    return false;
  }

  return true;
};

export const determineEvidenceRoute = (
  supportTypes: SupportType[],
  hasSupportNeedsInCRM: boolean
): EvidencePath => {
  if (hasSupportNeedsInCRM) {
    return EvidencePath.RETURNING_CANDIDATE;
  }
  if (isEvidenceRequired(supportTypes)) return EvidencePath.EVIDENCE_REQUIRED;

  if (supportTypes.includes(SupportType.OTHER))
    return EvidencePath.EVIDENCE_MAY_BE_REQUIRED;

  return EvidencePath.EVIDENCE_NOT_REQUIRED;
};
