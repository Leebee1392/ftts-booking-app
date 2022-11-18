import { EvidencePath, SupportType } from "../../../src/domain/enums";
import {
  determineEvidenceRoute,
  isDeafCandidate,
} from "../../../src/helpers/evidence-helper";

const evidenceMatch: Array<[SupportType[], EvidencePath]> = [
  // 1 option
  [[SupportType.ON_SCREEN_BSL], EvidencePath.EVIDENCE_NOT_REQUIRED],
  [[SupportType.BSL_INTERPRETER], EvidencePath.EVIDENCE_NOT_REQUIRED],
  [[SupportType.VOICEOVER], EvidencePath.EVIDENCE_NOT_REQUIRED],
  [[SupportType.TRANSLATOR], EvidencePath.EVIDENCE_NOT_REQUIRED],
  [[SupportType.EXTRA_TIME], EvidencePath.EVIDENCE_REQUIRED],
  [[SupportType.READING_SUPPORT], EvidencePath.EVIDENCE_REQUIRED],
  [[SupportType.OTHER], EvidencePath.EVIDENCE_MAY_BE_REQUIRED],
  // 2 options
  [
    [SupportType.ON_SCREEN_BSL, SupportType.BSL_INTERPRETER],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.BSL_INTERPRETER],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [SupportType.ON_SCREEN_BSL, SupportType.EXTRA_TIME],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [SupportType.BSL_INTERPRETER, SupportType.EXTRA_TIME],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [SupportType.ON_SCREEN_BSL, SupportType.READING_SUPPORT],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.ON_SCREEN_BSL, SupportType.OTHER],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [SupportType.BSL_INTERPRETER, SupportType.READING_SUPPORT],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.BSL_INTERPRETER, SupportType.OTHER],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.EXTRA_TIME],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.READING_SUPPORT],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.OTHER],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [SupportType.EXTRA_TIME, SupportType.READING_SUPPORT],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [[SupportType.EXTRA_TIME, SupportType.OTHER], EvidencePath.EVIDENCE_REQUIRED],
  [
    [SupportType.READING_SUPPORT, SupportType.OTHER],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.ON_SCREEN_BSL, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [SupportType.BSL_INTERPRETER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [SupportType.EXTRA_TIME, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.READING_SUPPORT, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.OTHER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  // 3 options
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
    ],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [SupportType.ON_SCREEN_BSL, SupportType.BSL_INTERPRETER, SupportType.OTHER],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.READING_SUPPORT,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
    ],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.READING_SUPPORT,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.BSL_INTERPRETER, SupportType.VOICEOVER, SupportType.OTHER],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.EXTRA_TIME, SupportType.OTHER],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.EXTRA_TIME, SupportType.READING_SUPPORT, SupportType.OTHER],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.ON_SCREEN_BSL, SupportType.READING_SUPPORT, SupportType.OTHER],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.READING_SUPPORT, SupportType.OTHER],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [SupportType.ON_SCREEN_BSL, SupportType.EXTRA_TIME, SupportType.OTHER],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [SupportType.BSL_INTERPRETER, SupportType.EXTRA_TIME, SupportType.OTHER],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [SupportType.ON_SCREEN_BSL, SupportType.VOICEOVER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [SupportType.ON_SCREEN_BSL, SupportType.EXTRA_TIME, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.ON_SCREEN_BSL, SupportType.OTHER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.EXTRA_TIME, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.VOICEOVER,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.VOICEOVER, SupportType.OTHER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [SupportType.READING_SUPPORT, SupportType.OTHER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [SupportType.BSL_INTERPRETER, SupportType.OTHER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [SupportType.EXTRA_TIME, SupportType.OTHER, SupportType.TRANSLATOR],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  // 4 options
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_NOT_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ],
  [
    [
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.VOICEOVER,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.EXTRA_TIME,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ], // Deaf candidate with extra time
  // 5 options
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ],
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_MAY_BE_REQUIRED,
  ], // Deaf candidate with extra time
  // 6 options
  [
    [
      SupportType.BSL_INTERPRETER,
      SupportType.VOICEOVER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
  [
    [
      SupportType.ON_SCREEN_BSL,
      SupportType.BSL_INTERPRETER,
      SupportType.EXTRA_TIME,
      SupportType.READING_SUPPORT,
      SupportType.OTHER,
      SupportType.TRANSLATOR,
    ],
    EvidencePath.EVIDENCE_REQUIRED,
  ], // Deaf candidate with extra time
];

describe("evidence-helper", () => {
  describe("isDeafCandidate", () => {
    test.each([
      [[SupportType.BSL_INTERPRETER], true],
      [[SupportType.ON_SCREEN_BSL], true],
      [[SupportType.BSL_INTERPRETER, SupportType.ON_SCREEN_BSL], true],
      [[SupportType.EXTRA_TIME], false],
    ])(
      'for given support types: %s returns "%s"',
      (supportTypesEntry: SupportType[], expectedResult: boolean) => {
        expect(isDeafCandidate(supportTypesEntry)).toBe(expectedResult);
      }
    );
  });

  describe("determineEvidenceRoute", () => {
    test.each(evidenceMatch)(
      'for given support types: %s and has hasSupportNeedsInCRM is "false", returns "%s"',
      (supportTypesEntry: SupportType[], expectedPath: string) => {
        expect(determineEvidenceRoute(supportTypesEntry, false)).toEqual(
          expectedPath
        );
      }
    );

    test.each(evidenceMatch)(
      'for given support types: %s and has hasSupportNeedsInCRM is "true", returns "returning-candidate"',
      (supportTypesEntry: SupportType[]) => {
        expect(determineEvidenceRoute(supportTypesEntry, true)).toEqual(
          EvidencePath.RETURNING_CANDIDATE
        );
      }
    );
  });
});
