/* istanbul ignore file */
import express from 'express';
import manageBookingLogin from '@controllers/manage-booking-login/manage-booking-login';
import manageBookingHome from '@controllers/manage-booking-home/manage-booking-home';
import manageBookingChange from '@controllers/manage-booking-change/manage-booking-change';
import manageBookingCancel from '@controllers/manage-booking-cancel/manage-booking-cancel';
import manageBookingCheckChange from '@controllers/manage-booking-check-change/manage-booking-check-change';
import manageBookingRequestRefund from '@controllers/manage-booking-request-refund/manage-booking-request-refund';
import voiceover from '@controllers/voiceover/voiceover';
import changeLocationTime from '@controllers/change-location-time/change-location-time';
import selectDate from '@controllers/select-date/select-date';
import chooseAppointment from '@controllers/choose-appointment/choose-appointment';
import findTestCentre from '@controllers/find-test-centre/find-test-centre';
import selectTestCentre from '@controllers/select-test-centre/select-test-centre';
import testLanguage from '@controllers/test-language/test-language';
import britishSignLanguage from '@controllers/british-sign-language/british-sign-language';
import errorTechnical from '@controllers/error-technical/error-technical';
import checkYourDetails from '@controllers/manage-booking-check-your-details/manage-booking-check-your-details';
import { setupSession } from '../middleware/setup-session';
import { setContext } from '../middleware/set-context';
import { internationalisation } from '../middleware/internationalisation';
import { setTarget } from '../middleware/set-target';
import { validateRequest } from '../middleware/request-validator';
import { asyncErrorHandler } from '../middleware/error-handler';
import {
  manageReschedulingAuth, manageBookingNsaAuth, manageBookingHomeAuth, manageBookingViewAuth,
} from '../middleware/auth';

export const manageBookingRouter = express.Router();

manageBookingRouter.get(['/', '/login'], setupSession, setTarget, internationalisation, setContext, manageBookingLogin.get);
manageBookingRouter.post(['/login'], validateRequest(manageBookingLogin.postSchemaValidation), asyncErrorHandler(manageBookingLogin.post));
manageBookingRouter.get(['/home'], manageBookingHomeAuth, asyncErrorHandler(manageBookingHome.get));
manageBookingRouter.get(['/manage-change-location-time/:ref'], changeLocationTime.get);
manageBookingRouter.post(['/manage-change-location-time/:ref'], validateRequest(changeLocationTime.postSchema), changeLocationTime.post);
manageBookingRouter.get(['/choose-appointment'], manageReschedulingAuth, validateRequest(chooseAppointment.getSchemaValidation), asyncErrorHandler(chooseAppointment.get));
manageBookingRouter.post(['/choose-appointment'], manageReschedulingAuth, validateRequest(chooseAppointment.postSchemaValidation), asyncErrorHandler(chooseAppointment.post));
manageBookingRouter.get(['/select-date'], manageReschedulingAuth, selectDate.get);
manageBookingRouter.post(['/select-date'], manageReschedulingAuth, validateRequest(selectDate.postSchemaValidation), selectDate.post);
manageBookingRouter.get(['/find-test-centre'], manageReschedulingAuth, findTestCentre.get);
manageBookingRouter.post(['/find-test-centre'], manageReschedulingAuth, validateRequest(findTestCentre.postSchemaValidation), findTestCentre.post);
manageBookingRouter.get(['/select-test-centre'], manageReschedulingAuth, validateRequest(selectTestCentre.getSchemaValidation()), asyncErrorHandler(selectTestCentre.get));
manageBookingRouter.post(['/select-test-centre'], manageReschedulingAuth, validateRequest(selectTestCentre.postSchemaValidation()), selectTestCentre.post);
manageBookingRouter.get(['/check-change'], manageReschedulingAuth, manageBookingCheckChange.get);
manageBookingRouter.post(['/check-change'], manageReschedulingAuth, asyncErrorHandler(manageBookingCheckChange.post));
manageBookingRouter.get(['/check-change/reset'], manageReschedulingAuth, manageBookingCheckChange.reset);
manageBookingRouter.get(['/test-language'], manageReschedulingAuth, testLanguage.get);
manageBookingRouter.post(['/test-language'], manageReschedulingAuth, validateRequest(testLanguage.testLanguagePostSchema()), testLanguage.post);
manageBookingRouter.get(['/change-voiceover'], manageReschedulingAuth, voiceover.get);
manageBookingRouter.post(['/change-voiceover'], manageReschedulingAuth, validateRequest(voiceover.voiceoverPostSchema()), voiceover.post);
manageBookingRouter.get(['/bsl'], manageReschedulingAuth, britishSignLanguage.get);
manageBookingRouter.post(['/bsl'], manageReschedulingAuth, validateRequest(britishSignLanguage.postSchemaValidation), britishSignLanguage.post);
manageBookingRouter.get(['/request-refund'], manageBookingHomeAuth, manageBookingRequestRefund.get);
manageBookingRouter.post(['/request-refund'], manageBookingHomeAuth, asyncErrorHandler(manageBookingRequestRefund.post));
manageBookingRouter.get(['/:ref'], manageBookingViewAuth, asyncErrorHandler(manageBookingChange.get));
manageBookingRouter.get(['/:ref/cancel'], manageBookingViewAuth, manageBookingCancel.get);
manageBookingRouter.post(['/:ref/cancel'], manageBookingViewAuth, asyncErrorHandler(manageBookingCancel.post));
manageBookingRouter.get(['/error-technical'], asyncErrorHandler(errorTechnical.get));

manageBookingRouter.get(['/nsa/check-your-details'], manageBookingNsaAuth, checkYourDetails.get);
manageBookingRouter.post(['/nsa/check-your-details'], manageBookingNsaAuth, checkYourDetails.post);
