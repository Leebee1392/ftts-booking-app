"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ManageBookingStartChangeController {
    constructor() {
        this.get = (req, res) => res.render("manage-booking/start-change");
    }
}
exports.default = new ManageBookingStartChangeController();
