/* istanbul ignore file */
import { Request, Response } from 'express';

export class StartController {
  public get = (req: Request, res: Response): void => res.render('govuk/start');
}

export default new StartController();
