/* istanbul ignore file */
import { Request, Response } from "express";

class ManageBookingStartChangeController {
  public get = (req: Request, res: Response): void =>
    res.render("manage-booking/start-change");
}

export default new ManageBookingStartChangeController();
