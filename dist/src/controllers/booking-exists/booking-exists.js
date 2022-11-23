"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingExistsController = void 0;
class BookingExistsController {
    constructor() {
        this.get = (req, res) => {
            res.render("common/booking-exists", {
                backLink: req.session.lastPage,
            });
        };
    }
}
exports.BookingExistsController = BookingExistsController;
exports.default = new BookingExistsController();
