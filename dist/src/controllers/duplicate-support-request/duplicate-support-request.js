"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateSupportRequest = void 0;
const nsa_navigator_1 = __importDefault(require("../../helpers/nsa-navigator"));
class DuplicateSupportRequest {
    constructor() {
        this.get = (req, res) => this.render(req, res);
        this.render = (req, res) => {
            res.render("common/duplicate-support-request", {
                backLink: this.getBackLink(req),
            });
        };
        this.getBackLink = (req) => {
            if (req.session.lastPage === "nsa/leaving-nsa") {
                return "leaving-nsa";
            }
            return nsa_navigator_1.default.getPreviousPage(req);
        };
    }
}
exports.DuplicateSupportRequest = DuplicateSupportRequest;
exports.default = new DuplicateSupportRequest();
