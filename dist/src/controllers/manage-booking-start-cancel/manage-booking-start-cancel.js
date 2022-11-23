"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ManageBookingStartCancelController {
    constructor() {
        this.get = (req, res) => res.render("manage-booking/start-cancel");
    }
}
exports.default = new ManageBookingStartCancelController();
