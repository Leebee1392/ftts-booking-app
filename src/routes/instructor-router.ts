/* istanbul ignore file */
import express from "express";
import instructorChangeLocationTime from "@controllers/instructor-change-location-time/instructor-change-location-time";
import bookingConfirmation from "@controllers/booking-confirmation/booking-confirmation";
import instructorCandidateDetails from "@controllers/instructor-candidate-details/instructor-candidate-details";
import chooseAppointment from "@controllers/choose-appointment/choose-appointment";
import supportAlertController from "@controllers/support-alert/support-alert";
import instructorChooseSupport from "@controllers/instructor-choose-support/instructor-choose-support";
import emailContact from "@controllers/email-contact/email-contact";
import instructorFindTestCentre from "@controllers/instructor-find-test-centre/instructor-find-test-centre";
import testLanguage from "@controllers/test-language/test-language";
import testType from "@controllers/test-type/test-type";
import receivedSupportRequest from "@controllers/received-support-request/received-support-request";
import instructorVoiceover from "@controllers/instructor-voiceover/instructor-voiceover";
import instructorCheckYourAnswers from "@controllers/instructor-check-your-answers/instructor-check-your-answers";
import bookingExists from "@controllers/booking-exists/booking-exists";
import paymentConfirmation from "@controllers/payment-confirmation/payment-confirmation";
import paymentInitiation from "@controllers/payment-initiation/payment-initiation";
import instructorBritishSignLanguage from "@controllers/instructor-british-sign-language/instructor-british-sign-language";
import instructorSelectDate from "@controllers/instructor-select-date/instructor-select-date";
import instructorSelectTestCentre from "@controllers/instructor-select-test-centre/instructor-select-test-centre";
import instructorCheckYourDetails from "@controllers/instructor-check-your-details/instructor-check-your-details";
import instructorCustomSupport from "@controllers/instructor-custom-support/instructor-custom-support";
import instructorConfirmSupport from "@controllers/instructor-confirm-support/instructor-confirm-support";
import leavingNsa from "@controllers/leaving-nsa/leaving-nsa";
import instructorPreferredDay from "@controllers/instructor-preferred-day/instructor-preferred-day";
import instructorPreferredLocation from "@controllers/instructor-preferred-location/instructor-preferred-location";
import selectSupportType from "@controllers/select-support-type/select-support-type";
import instructorDuplicateSupportRequest from "@controllers/duplicate-support-request/duplicate-support-request";
import instructorTelephoneContact from "@controllers/instructor-telephone-contact/instructor-telephone-contact";
import instructorTranslator from "@controllers/instructor-translator/instructor-translator";
import instructorVoicemail from "@controllers/instructor-voicemail/instructor-voicemail";
import instructorSelectStandardSupport from "@controllers/select-standard-support/select-standard-support";
import errorTechnical from "@controllers/error-technical/error-technical";
import stayingNsa from "@controllers/staying-nsa/staying-nsa";
import paymentConfirmationLoading from "@controllers/payment-confirmation-loading/payment-confirmation-loading";
import { paymentRedirect } from "../middleware/payment-redirect";
import { setContext } from "../middleware/set-context";
import { internationalisation } from "../middleware/internationalisation";
import { setupSession } from "../middleware/setup-session";
import { setTarget } from "../middleware/set-target";
import {
  conditionalValidateRequest,
  validateRequest,
} from "../middleware/request-validator";
import { asyncErrorHandler } from "../middleware/error-handler";
import {
  commonAuth,
  instructorStandardAuth,
  startAuth,
  supportAuth,
} from "../middleware/auth";

export const instructorRouter = express.Router();

// Instructor Tests - Standard
instructorRouter.get(
  ["/", "/choose-support"],
  setupSession,
  setTarget,
  internationalisation,
  setContext,
  startAuth,
  instructorChooseSupport.get
);
instructorRouter.post(
  ["/choose-support"],
  validateRequest(instructorChooseSupport.postSchemaValidation()),
  instructorChooseSupport.post
);
instructorRouter.get(["/support-alert"], startAuth, supportAlertController.get);
instructorRouter.post(
  ["/support-alert"],
  startAuth,
  supportAlertController.post
);
instructorRouter.get(
  ["/candidate-details"],
  startAuth,
  instructorCandidateDetails.get
);
instructorRouter.post(
  ["/candidate-details"],
  startAuth,
  validateRequest(instructorCandidateDetails.postSchemaValidation),
  asyncErrorHandler(instructorCandidateDetails.post)
);
instructorRouter.get(
  ["/email-contact"],
  instructorStandardAuth,
  emailContact.get
);
instructorRouter.post(
  ["/email-contact"],
  instructorStandardAuth,
  validateRequest(emailContact.postSchemaValidation()),
  emailContact.post
);
instructorRouter.get(
  ["/test-type"],
  commonAuth,
  asyncErrorHandler(testType.get)
);
instructorRouter.post(
  ["/test-type"],
  commonAuth,
  validateRequest(testType.postSchemaValidation),
  asyncErrorHandler(testType.post)
);
instructorRouter.get(
  ["/received-support-request"],
  commonAuth,
  receivedSupportRequest.get
);
instructorRouter.get(["/test-language"], commonAuth, testLanguage.get);
instructorRouter.post(
  ["/test-language"],
  commonAuth,
  validateRequest(testLanguage.testLanguagePostSchema()),
  testLanguage.post
);
instructorRouter.get(
  ["/find-test-centre"],
  instructorStandardAuth,
  instructorFindTestCentre.get
);
instructorRouter.post(
  ["/find-test-centre"],
  instructorStandardAuth,
  validateRequest(instructorFindTestCentre.postSchemaValidation),
  instructorFindTestCentre.post
);
instructorRouter.get(
  ["/select-test-centre"],
  instructorStandardAuth,
  validateRequest(instructorSelectTestCentre.getSchemaValidation()),
  asyncErrorHandler(instructorSelectTestCentre.get)
);
instructorRouter.post(
  ["/select-test-centre"],
  instructorStandardAuth,
  validateRequest(instructorSelectTestCentre.postSchemaValidation()),
  asyncErrorHandler(instructorSelectTestCentre.post)
);
instructorRouter.get(
  ["/select-date"],
  instructorStandardAuth,
  instructorSelectDate.get
);
instructorRouter.post(
  ["/select-date"],
  instructorStandardAuth,
  validateRequest(instructorSelectDate.postSchemaValidation),
  instructorSelectDate.post
);
instructorRouter.get(
  ["/choose-appointment"],
  instructorStandardAuth,
  validateRequest(chooseAppointment.getSchemaValidation),
  asyncErrorHandler(chooseAppointment.get)
);
instructorRouter.post(
  ["/choose-appointment"],
  instructorStandardAuth,
  validateRequest(chooseAppointment.postSchemaValidation),
  asyncErrorHandler(chooseAppointment.post)
);
instructorRouter.get(
  ["/check-your-answers"],
  instructorStandardAuth,
  instructorCheckYourAnswers.get
);
instructorRouter.post(
  ["/check-your-answers"],
  instructorStandardAuth,
  asyncErrorHandler(instructorCheckYourAnswers.post)
);
instructorRouter.get(
  ["/booking-exists"],
  instructorStandardAuth,
  bookingExists.get
);
instructorRouter.get(
  ["/bsl"],
  instructorStandardAuth,
  instructorBritishSignLanguage.get
);
instructorRouter.post(
  ["/bsl"],
  instructorStandardAuth,
  validateRequest(instructorBritishSignLanguage.postSchemaValidation),
  instructorBritishSignLanguage.post
);
instructorRouter.get(
  ["/payment-initiation"],
  instructorStandardAuth,
  asyncErrorHandler(paymentInitiation.get)
);
instructorRouter.get(
  ["/payment-confirmation-loading/:bookingReference?"],
  instructorStandardAuth,
  paymentConfirmationLoading.get
);
instructorRouter.get(
  ["/payment-confirmation/:bookingReference?"],
  paymentRedirect,
  instructorStandardAuth,
  asyncErrorHandler(paymentConfirmation.get)
);
instructorRouter.get(
  ["/booking-confirmation"],
  commonAuth,
  bookingConfirmation.get
);
instructorRouter.get(
  ["/change-location-time"],
  instructorStandardAuth,
  instructorChangeLocationTime.get
);
instructorRouter.get(
  ["/select-standard-support"],
  commonAuth,
  instructorSelectStandardSupport.get
);
instructorRouter.post(
  ["/select-standard-support"],
  commonAuth,
  validateRequest(instructorSelectStandardSupport.postSchemaValidation()),
  instructorSelectStandardSupport.post
);
instructorRouter.post(
  ["/change-location-time"],
  instructorStandardAuth,
  validateRequest(instructorChangeLocationTime.postSchema),
  instructorChangeLocationTime.post
);
instructorRouter.get(
  ["/change-voiceover"],
  instructorStandardAuth,
  instructorVoiceover.get
);
instructorRouter.post(
  ["/change-voiceover"],
  instructorStandardAuth,
  validateRequest(instructorVoiceover.voiceoverPostSchema()),
  instructorVoiceover.post
);
instructorRouter.get(
  ["/error-technical"],
  asyncErrorHandler(errorTechnical.get)
);

// Instructor Tests - NSA
instructorRouter.get(
  ["/nsa/candidate-details"],
  setupSession,
  setTarget,
  internationalisation,
  setContext,
  startAuth,
  instructorCandidateDetails.get
);
instructorRouter.post(
  ["/nsa/candidate-details"],
  startAuth,
  validateRequest(instructorCandidateDetails.postSchemaValidation),
  asyncErrorHandler(instructorCandidateDetails.post)
);
instructorRouter.get(
  ["/nsa/test-type"],
  supportAuth,
  asyncErrorHandler(testType.get)
);
instructorRouter.post(
  ["/nsa/test-type"],
  supportAuth,
  validateRequest(testType.postSchemaValidation),
  asyncErrorHandler(testType.post)
);
instructorRouter.get(
  ["/nsa/received-support-request"],
  supportAuth,
  receivedSupportRequest.get
);
instructorRouter.get(["/nsa/test-language"], supportAuth, testLanguage.get);
instructorRouter.post(
  ["/nsa/test-language"],
  supportAuth,
  validateRequest(testLanguage.testLanguagePostSchema()),
  testLanguage.post
);
instructorRouter.get(
  ["/nsa/select-support-type"],
  supportAuth,
  selectSupportType.get
);
instructorRouter.post(
  ["/nsa/select-support-type"],
  supportAuth,
  conditionalValidateRequest(selectSupportType.postSchemaValidation),
  selectSupportType.post
);
instructorRouter.get(
  ["/nsa/change-voiceover"],
  supportAuth,
  instructorVoiceover.get
);
instructorRouter.post(
  ["/nsa/change-voiceover"],
  supportAuth,
  validateRequest(instructorVoiceover.voiceoverPostSchema()),
  instructorVoiceover.post
);
instructorRouter.get(
  ["/nsa/translator"],
  supportAuth,
  instructorTranslator.get
);
instructorRouter.post(
  ["/nsa/translator"],
  supportAuth,
  validateRequest(instructorTranslator.postSchemaValidation),
  instructorTranslator.post
);
instructorRouter.get(
  ["/nsa/custom-support"],
  supportAuth,
  instructorCustomSupport.get
);
instructorRouter.post(
  ["/nsa/custom-support"],
  supportAuth,
  validateRequest(instructorCustomSupport.postSchemaValidation()),
  instructorCustomSupport.post
);
instructorRouter.get(
  ["/nsa/confirm-support"],
  supportAuth,
  instructorConfirmSupport.get
);
instructorRouter.post(
  ["/nsa/confirm-support"],
  supportAuth,
  validateRequest(instructorConfirmSupport.postSchemaValidation()),
  instructorConfirmSupport.post
);
instructorRouter.get(["/nsa/leaving-nsa"], supportAuth, leavingNsa.get);
instructorRouter.post(
  ["/nsa/leaving-nsa"],
  supportAuth,
  asyncErrorHandler(leavingNsa.post)
);
instructorRouter.get(
  ["/nsa/staying-nsa"],
  supportAuth,
  asyncErrorHandler(stayingNsa.get)
);
instructorRouter.get(["/nsa/email-contact"], supportAuth, emailContact.get);
instructorRouter.post(
  ["/nsa/email-contact"],
  supportAuth,
  validateRequest(emailContact.postSchemaValidation()),
  emailContact.post
);
instructorRouter.get(
  ["/nsa/preferred-day"],
  supportAuth,
  instructorPreferredDay.get
);
instructorRouter.post(
  ["/nsa/preferred-day"],
  supportAuth,
  conditionalValidateRequest(instructorPreferredDay.postSchemaValidation),
  instructorPreferredDay.post
);
instructorRouter.get(
  ["/nsa/preferred-location"],
  supportAuth,
  instructorPreferredLocation.get
);
instructorRouter.post(
  ["/nsa/preferred-location"],
  supportAuth,
  conditionalValidateRequest(instructorPreferredLocation.postSchemaValidation),
  instructorPreferredLocation.post
);
instructorRouter.get(
  ["/nsa/telephone-contact"],
  supportAuth,
  instructorTelephoneContact.get
);
instructorRouter.post(
  ["/nsa/telephone-contact"],
  supportAuth,
  conditionalValidateRequest(instructorTelephoneContact.postSchemaValidation),
  instructorTelephoneContact.post
);
instructorRouter.get(["/nsa/voicemail"], supportAuth, instructorVoicemail.get);
instructorRouter.post(
  ["/nsa/voicemail"],
  supportAuth,
  validateRequest(instructorVoicemail.postSchemaValidation()),
  instructorVoicemail.post
);
instructorRouter.get(
  ["/nsa/check-your-details"],
  supportAuth,
  instructorCheckYourDetails.get
);
instructorRouter.post(
  ["/nsa/check-your-details"],
  supportAuth,
  asyncErrorHandler(instructorCheckYourDetails.post)
);
instructorRouter.get(
  ["/nsa/duplicate-support-request"],
  supportAuth,
  instructorDuplicateSupportRequest.get
);
