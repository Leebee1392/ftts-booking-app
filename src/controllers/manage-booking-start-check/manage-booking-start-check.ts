/* istanbul ignore file */
import { Request, Response } from "express";

class ManageBookingStartCheckController {
  public get = (req: Request, res: Response): void =>
    res.render("manage-booking/start-check");
}

export default new ManageBookingStartCheckController();
