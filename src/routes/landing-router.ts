/* istanbul ignore file */
import express from 'express';
import start from '@controllers/start/start';
import manageBookingStartCheck from '@controllers/manage-booking-start-check/manage-booking-start-check';
import manageBookingStartChange from '@controllers/manage-booking-start-change/manage-booking-start-change';
import manageBookingStartCancel from '@controllers/manage-booking-start-cancel/manage-booking-start-cancel';
import config from '../config';
import { setContext } from '../middleware/set-context';
import { setTarget } from '../middleware/set-target';
import { setupSession } from '../middleware/setup-session';
import { internationalisation } from '../middleware/internationalisation';

export const landingRouter = express.Router();

if (config.landing.enableInternalEntrypoints) {
  landingRouter.get(['/landing/create'], start.get);
  landingRouter.get(['/landing/check'], manageBookingStartCheck.get);
  landingRouter.get(['/landing/change'], manageBookingStartChange.get);
  landingRouter.get(['/landing/cancel'], manageBookingStartCancel.get);
}

landingRouter.get(['/check', '/change', '/cancel', '/instructor-manage-test', '/manage-instructor-booking'], setupSession, setTarget, internationalisation, setContext, (req, res) => res.redirect('/manage-booking'));
