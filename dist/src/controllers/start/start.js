"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartController = void 0;
class StartController {
    constructor() {
        this.get = (req, res) => res.render("govuk/start");
    }
}
exports.StartController = StartController;
exports.default = new StartController();
