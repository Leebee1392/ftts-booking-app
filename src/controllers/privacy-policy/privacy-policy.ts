import { Request, Response } from 'express';

export class PrivacyPolicyController {
  public get = (req: Request, res: Response): void => {
    if (!req.headers.referer?.match(/privacy-policy/)) {
      req.session.lastPage = req.headers.referer?.split('?')[0] || '/';
    }
    res.render('common/privacy-policy', {
      backLink: req.session.lastPage,
    });
  };
}

export default new PrivacyPolicyController();
