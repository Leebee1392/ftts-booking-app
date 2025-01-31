import { Request, Response } from 'express';
import config from '../../config';
import { logger } from '../../helpers/logger';

export class PaymentConfirmationLoading {
  public get = (req: Request, res: Response):void => {
    const { currentBooking: booking } = req.session;
    if (!booking?.bookingRef) {
      logger.critical('PaymentConfirmationLoading:: get : Missing required booking reference number');
      throw new Error('PaymentConfirmationLoading:: get : Missing required booking reference number');
    }

    const redirectUrl = req.session.journey?.isInstructor ? `/instructor/payment-confirmation/${booking.bookingRef}` : `/payment-confirmation/${booking.bookingRef}`;
    return res.render('create/payment-confirmation-loading', {
      redirectUrl,
      refreshTime: config.refreshTimeForLandingPage,
    });
  };
}

export default new PaymentConfirmationLoading();
