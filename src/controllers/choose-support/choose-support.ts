import { Request, Response } from 'express';
import { YesNo } from '../../domain/enums';
import { translate } from '../../helpers/language';
import { getBackLinkToStartPage } from '../../helpers/start-page-navigator';
import { ValidatorSchema } from '../../middleware/request-validator';
import { store } from '../../services/session';
import { YesOrNo } from '../../value-objects/yes-or-no';

interface ChooseSupportBody {
  chooseSupport: YesNo;
}
export class ChooseSupportController {
  public get = (req: Request, res: Response): void => {
    if (!req.session.journey) {
      throw Error('ChooseSupportController::get: No journey set');
    }

    return this.renderPage(req, res);
  };

  public post = (req: Request, res: Response): void => {
    if (req.hasErrors) {
      return this.renderPage(req, res);
    }
    if (!req.session.journey) {
      throw Error('ChooseSupportController::post: No journey set');
    }

    const { chooseSupport } = req.body as ChooseSupportBody;
    const { inEditMode } = req.session.journey;
    const supportRequested = chooseSupport === YesNo.YES;

    if (inEditMode) {
      req.session.journey = {
        ...req.session.journey,
        support: supportRequested,
        standardAccommodation: !supportRequested,
        inEditMode: false,
      };
      store.resetBooking(req);
      req.session.currentBooking = {}; // We want current booking to still be defined here.

      return !supportRequested ? res.redirect('email-contact') : res.redirect('nsa/test-type');
    }

    req.session.journey = {
      ...req.session.journey,
      support: false,
      standardAccommodation: true,
    };

    return !supportRequested ? res.redirect('candidate-details') : res.redirect('support-alert');
  };

  private renderPage(req: Request, res: Response): void {
    if (!req.session.journey) {
      throw Error('ChooseSupportController::renderPage: No journey set');
    }
    const { inEditMode, standardAccommodation } = req.session.journey;
    let backLink: string;

    if (inEditMode) {
      backLink = standardAccommodation ? 'check-your-answers' : 'nsa/check-your-details';
    } else {
      backLink = this.getBackLink(req);
    }

    if (req.errors?.length) {
      req.errors[0].msg = translate('chooseSupport.errorMessage');
    }

    return res.render('common/choose-support', {
      errors: req.errors,
      backLink,
      booking: req.session.currentBooking,
    });
  }

  private getBackLink(req: Request): string {
    return getBackLinkToStartPage(req);
  }

  /* istanbul ignore next */
  public postSchemaValidation(): ValidatorSchema {
    return {
      chooseSupport: {
        in: ['body'],
        custom: {
          options: YesOrNo.isValid,
        },
      },
    };
  }
}

export default new ChooseSupportController();
