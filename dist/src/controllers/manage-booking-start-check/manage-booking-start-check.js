"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ManageBookingStartCheckController {
    constructor() {
        this.get = (req, res) => res.render("manage-booking/start-check");
    }
}
exports.default = new ManageBookingStartCheckController();
