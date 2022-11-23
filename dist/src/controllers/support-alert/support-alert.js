"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportAlertController = void 0;
class SupportAlertController {
    constructor() {
        this.get = (req, res) => {
            res.render("supported/support-alert", {
                backLink: "choose-support",
            });
        };
        this.post = (req, res) => {
            req.session.journey = {
                ...req.session.journey,
                support: true,
                standardAccommodation: false,
                inEditMode: false,
            };
            res.redirect("nsa/candidate-details");
        };
    }
}
exports.SupportAlertController = SupportAlertController;
exports.default = new SupportAlertController();
