/* istanbul ignore file */
import express from "express";
import changeLocationTime from "@controllers/change-location-time/change-location-time";
import bookingConfirmation from "@controllers/booking-confirmation/booking-confirmation";
import candidateDetails from "@controllers/candidate-details/candidate-details";
import supportAlert from "@controllers/support-alert/support-alert";
import chooseAppointment from "@controllers/choose-appointment/choose-appointment";
import chooseSupport from "@controllers/choose-support/choose-support";
import cookiePolicy from "@controllers/cookie-policy/cookie-policy";
import emailContact from "@controllers/email-contact/email-contact";
import findTestCentre from "@controllers/find-test-centre/find-test-centre";
import testLanguage from "@controllers/test-language/test-language";
import testType from "@controllers/test-type/test-type";
import receivedSupportRequest from "@controllers/received-support-request/received-support-request";
import voiceover from "@controllers/voiceover/voiceover";
import checkYourAnswers from "@controllers/check-your-answers/check-your-answers";
import bookingExists from "@controllers/booking-exists/booking-exists";
import paymentConfirmation from "@controllers/payment-confirmation/payment-confirmation";
import paymentInitiation from "@controllers/payment-initiation/payment-initiation";
import paymentConfirmationLoading from "@controllers/payment-confirmation-loading/payment-confirmation-loading";
import britishSignLanguage from "@controllers/british-sign-language/british-sign-language";
import selectDate from "@controllers/select-date/select-date";
import selectTestCentre from "@controllers/select-test-centre/select-test-centre";
import checkYourDetails from "@controllers/check-your-details/check-your-details";
import customSupport from "@controllers/custom-support/custom-support";
import leavingNsa from "@controllers/leaving-nsa/leaving-nsa";
import preferredDay from "@controllers/preferred-day/preferred-day";
import preferredLocation from "@controllers/preferred-location/preferred-location";
import selectSupportType from "@controllers/select-support-type/select-support-type";
import selectStandardSupport from "@controllers/select-standard-support/select-standard-support";
import confirmSupport from "@controllers/confirm-support/confirm-support";
import stayingNsa from "@controllers/staying-nsa/staying-nsa";
import telephoneContact from "@controllers/telephone-contact/telephone-contact";
import translator from "@controllers/translator/translator";
import voicemail from "@controllers/voicemail/voicemail";
import duplicateSupportRequest from "@controllers/duplicate-support-request/duplicate-support-request";
import timeout from "@controllers/error-timeout/error-timeout";
import errorTechnical from "@controllers/error-technical/error-technical";
import accessibilityStatement from "@controllers/accessibility-statement/accessibility-statement";
import privacyPolicy from "@controllers/privacy-policy/privacy-policy";
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
  standardAuth,
  startAuth,
  supportAuth,
} from "../middleware/auth";
import { setContext } from "../middleware/set-context";
import { paymentRedirect } from "../middleware/payment-redirect";

export const candidateRouter = express.Router();

candidateRouter.get(
  ["/", "/choose-support"],
  setupSession,
  setTarget,
  internationalisation,
  setContext,
  startAuth,
  chooseSupport.get
);
candidateRouter.post(
  ["/choose-support"],
  startAuth,
  validateRequest(chooseSupport.postSchemaValidation()),
  chooseSupport.post
);
candidateRouter.get(["/support-alert"], startAuth, supportAlert.get);
candidateRouter.post(["/support-alert"], startAuth, supportAlert.post);
candidateRouter.get(["/candidate-details"], startAuth, candidateDetails.get);
candidateRouter.post(
  ["/candidate-details"],
  startAuth,
  validateRequest(candidateDetails.postSchemaValidation),
  asyncErrorHandler(candidateDetails.post)
);
candidateRouter.get(["/email-contact"], standardAuth, emailContact.get);
candidateRouter.post(
  ["/email-contact"],
  standardAuth,
  validateRequest(emailContact.postSchemaValidation()),
  emailContact.post
);
candidateRouter.get(
  ["/test-type"],
  commonAuth,
  asyncErrorHandler(testType.get)
);
candidateRouter.post(
  ["/test-type"],
  commonAuth,
  validateRequest(testType.postSchemaValidation),
  asyncErrorHandler(testType.post)
);
candidateRouter.get(
  ["/received-support-request"],
  commonAuth,
  receivedSupportRequest.get
);
candidateRouter.get(["/test-language"], commonAuth, testLanguage.get);
candidateRouter.post(
  ["/test-language"],
  commonAuth,
  validateRequest(testLanguage.testLanguagePostSchema()),
  testLanguage.post
);
candidateRouter.get(
  ["/select-standard-support"],
  commonAuth,
  selectStandardSupport.get
);
candidateRouter.post(
  ["/select-standard-support"],
  commonAuth,
  validateRequest(selectStandardSupport.postSchemaValidation()),
  selectStandardSupport.post
);
candidateRouter.get(["/change-voiceover"], standardAuth, voiceover.get);
candidateRouter.post(
  ["/change-voiceover"],
  standardAuth,
  validateRequest(voiceover.voiceoverPostSchema()),
  voiceover.post
);
candidateRouter.get(["/find-test-centre"], standardAuth, findTestCentre.get);
candidateRouter.post(
  ["/find-test-centre"],
  standardAuth,
  validateRequest(findTestCentre.postSchemaValidation),
  findTestCentre.post
);
candidateRouter.get(
  ["/select-test-centre"],
  standardAuth,
  validateRequest(selectTestCentre.getSchemaValidation()),
  asyncErrorHandler(selectTestCentre.get)
);
candidateRouter.post(
  ["/select-test-centre"],
  standardAuth,
  validateRequest(selectTestCentre.postSchemaValidation()),
  asyncErrorHandler(selectTestCentre.post)
);
candidateRouter.get(["/select-date"], standardAuth, selectDate.get);
candidateRouter.post(
  ["/select-date"],
  standardAuth,
  validateRequest(selectDate.postSchemaValidation),
  selectDate.post
);
candidateRouter.get(
  ["/choose-appointment"],
  standardAuth,
  validateRequest(chooseAppointment.getSchemaValidation),
  asyncErrorHandler(chooseAppointment.get)
);
candidateRouter.post(
  ["/choose-appointment"],
  standardAuth,
  validateRequest(chooseAppointment.postSchemaValidation),
  asyncErrorHandler(chooseAppointment.post)
);
candidateRouter.get(
  ["/check-your-answers"],
  standardAuth,
  checkYourAnswers.get
);
candidateRouter.post(
  ["/check-your-answers"],
  standardAuth,
  asyncErrorHandler(checkYourAnswers.post)
);
candidateRouter.get(["/booking-exists"], standardAuth, bookingExists.get);
candidateRouter.get(["/bsl"], standardAuth, britishSignLanguage.get);
candidateRouter.post(
  ["/bsl"],
  standardAuth,
  validateRequest(britishSignLanguage.postSchemaValidation),
  britishSignLanguage.post
);
candidateRouter.get(
  ["/payment-initiation"],
  standardAuth,
  asyncErrorHandler(paymentInitiation.get)
);
candidateRouter.get(
  ["/payment-confirmation-loading/:bookingReference?"],
  standardAuth,
  paymentConfirmationLoading.get
);
candidateRouter.get(
  ["/payment-confirmation/:bookingReference?"],
  paymentRedirect,
  standardAuth,
  asyncErrorHandler(paymentConfirmation.get)
);
candidateRouter.get(
  ["/booking-confirmation"],
  commonAuth,
  bookingConfirmation.get
);
candidateRouter.get(
  ["/change-location-time"],
  standardAuth,
  changeLocationTime.get
);
candidateRouter.post(
  ["/change-location-time"],
  standardAuth,
  validateRequest(changeLocationTime.postSchema),
  changeLocationTime.post
);
candidateRouter.get(["/accessibility-statement"], accessibilityStatement.get);
candidateRouter.get(["/privacy-policy"], privacyPolicy.get);
candidateRouter.get(["/view-cookies"], cookiePolicy.get);
candidateRouter.get(["/timeout"], asyncErrorHandler(timeout.get));
candidateRouter.get(
  ["/error-technical"],
  asyncErrorHandler(errorTechnical.get)
);

// Candidate Tests - NSA
candidateRouter.get(
  ["/nsa/candidate-details"],
  startAuth,
  candidateDetails.get
);
candidateRouter.post(
  ["/nsa/candidate-details"],
  startAuth,
  validateRequest(candidateDetails.postSchemaValidation),
  asyncErrorHandler(candidateDetails.post)
);
candidateRouter.get(
  ["/nsa/test-type"],
  supportAuth,
  asyncErrorHandler(testType.get)
);
candidateRouter.post(
  ["/nsa/test-type"],
  supportAuth,
  validateRequest(testType.postSchemaValidation),
  asyncErrorHandler(testType.post)
);
candidateRouter.get(
  ["/nsa/received-support-request"],
  supportAuth,
  receivedSupportRequest.get
);
candidateRouter.get(["/nsa/test-language"], supportAuth, testLanguage.get);
candidateRouter.post(
  ["/nsa/test-language"],
  supportAuth,
  validateRequest(testLanguage.testLanguagePostSchema()),
  testLanguage.post
);
candidateRouter.get(
  ["/nsa/select-support-type"],
  supportAuth,
  selectSupportType.get
);
candidateRouter.post(
  ["/nsa/select-support-type"],
  supportAuth,
  conditionalValidateRequest(selectSupportType.postSchemaValidation),
  selectSupportType.post
);
candidateRouter.get(["/nsa/change-voiceover"], supportAuth, voiceover.get);
candidateRouter.post(
  ["/nsa/change-voiceover"],
  supportAuth,
  validateRequest(voiceover.voiceoverPostSchema()),
  voiceover.post
);
candidateRouter.get(["/nsa/translator"], supportAuth, translator.get);
candidateRouter.post(
  ["/nsa/translator"],
  supportAuth,
  validateRequest(translator.postSchemaValidation),
  translator.post
);
candidateRouter.get(["/nsa/custom-support"], supportAuth, customSupport.get);
candidateRouter.post(
  ["/nsa/custom-support"],
  supportAuth,
  validateRequest(customSupport.postSchemaValidation()),
  customSupport.post
);
candidateRouter.get(["/nsa/confirm-support"], supportAuth, confirmSupport.get);
candidateRouter.post(
  ["/nsa/confirm-support"],
  supportAuth,
  validateRequest(confirmSupport.postSchemaValidation()),
  confirmSupport.post
);
candidateRouter.get(["/nsa/leaving-nsa"], supportAuth, leavingNsa.get);
candidateRouter.post(
  ["/nsa/leaving-nsa"],
  supportAuth,
  asyncErrorHandler(leavingNsa.post)
);
candidateRouter.get(
  ["/nsa/staying-nsa"],
  supportAuth,
  asyncErrorHandler(stayingNsa.get)
);
candidateRouter.get(["/nsa/email-contact"], supportAuth, emailContact.get);
candidateRouter.post(
  ["/nsa/email-contact"],
  supportAuth,
  validateRequest(emailContact.postSchemaValidation()),
  emailContact.post
);
candidateRouter.get(["/nsa/preferred-day"], supportAuth, preferredDay.get);
candidateRouter.post(
  ["/nsa/preferred-day"],
  supportAuth,
  conditionalValidateRequest(preferredDay.postSchemaValidation),
  preferredDay.post
);
candidateRouter.get(
  ["/nsa/preferred-location"],
  supportAuth,
  preferredLocation.get
);
candidateRouter.post(
  ["/nsa/preferred-location"],
  supportAuth,
  conditionalValidateRequest(preferredLocation.postSchemaValidation),
  preferredLocation.post
);
candidateRouter.get(
  ["/nsa/telephone-contact"],
  supportAuth,
  telephoneContact.get
);
candidateRouter.post(
  ["/nsa/telephone-contact"],
  supportAuth,
  conditionalValidateRequest(telephoneContact.postSchemaValidation),
  telephoneContact.post
);
candidateRouter.get(["/nsa/voicemail"], supportAuth, voicemail.get);
candidateRouter.post(
  ["/nsa/voicemail"],
  supportAuth,
  validateRequest(voicemail.postSchemaValidation()),
  voicemail.post
);
candidateRouter.get(
  ["/nsa/check-your-details"],
  supportAuth,
  checkYourDetails.get
);
candidateRouter.post(
  ["/nsa/check-your-details"],
  supportAuth,
  asyncErrorHandler(checkYourDetails.post)
);
candidateRouter.get(
  ["/nsa/duplicate-support-request"],
  supportAuth,
  duplicateSupportRequest.get
);
