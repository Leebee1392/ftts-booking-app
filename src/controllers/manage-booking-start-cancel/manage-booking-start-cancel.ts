/* istanbul ignore file */
import { Request, Response } from 'express';

class ManageBookingStartCancelController {
  public get = (req: Request, res: Response): void => res.render('manage-booking/start-cancel');
}

export default new ManageBookingStartCancelController();
