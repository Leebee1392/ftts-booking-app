import { Request, Response } from 'express';
import { YesNo } from '../../domain/enums';
import { translate } from '../../helpers/language';
import { ValidatorSchema } from '../../middleware/request-validator';
import { YesOrNo } from '../../value-objects/yes-or-no';

interface VoicemailBody {
  voicemail: YesNo;
}

export class VoicemailController {
  public get = (req: Request, res: Response): void => {
    if (!req.session.currentBooking) {
      throw Error('VoicemailController::get: No currentBooking set');
    }
    if (!req.session.journey) {
      throw Error('VoicemailController::get: No journey set');
    }
    const { inEditMode } = req.session.journey;
    const { voicemail } = req.session.currentBooking;

    const backLink = inEditMode ? 'check-your-details' : 'telephone-contact';

    res.render('supported/voicemail', {
      backLink,
      voicemailYes: voicemail === true,
      voicemailNo: voicemail === false,
    });
  };

  public post = (req: Request, res: Response): void => {
    if (req.hasErrors) {
      req.errors.forEach((error) => {
        error.msg = translate('voicemail.errorBannerNotification');
      });
      return res.render('supported/voicemail', {
        errors: req.errors,
      });
    }

    const { voicemail } = req.body as VoicemailBody;

    req.session.currentBooking = {
      ...req.session.currentBooking,
      voicemail: voicemail === YesNo.YES,
    };

    return res.redirect('check-your-details');
  };

  /* istanbul ignore next */
  public postSchemaValidation = (): ValidatorSchema => ({
    voicemail: {
      in: ['body'],
      custom: {
        options: YesOrNo.isValid,
      },
    },
  });
}

export default new VoicemailController();
