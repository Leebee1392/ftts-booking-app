import { Request, Response } from 'express';

export class BookingExistsController {
  public get = (req: Request, res: Response): void => {
    res.render('common/booking-exists', {
      backLink: req.session.lastPage,
    });
  };
}

export default new BookingExistsController();
