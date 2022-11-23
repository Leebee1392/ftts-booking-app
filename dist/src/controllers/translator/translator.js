"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslatorController = void 0;
const language_1 = require("../../helpers/language");
const nsa_navigator_1 = __importDefault(require("../../helpers/nsa-navigator"));
class TranslatorController {
    constructor() {
        this.get = (req, res) => this.renderPage(req, res);
        this.post = (req, res) => {
            if (req.hasErrors) {
                return this.renderPage(req, res);
            }
            if (!req.session.journey) {
                throw Error("TranslatorController::post: No journey set");
            }
            const { inEditMode } = req.session.journey;
            req.session.currentBooking = {
                ...req.session.currentBooking,
                translator: req.body.translator,
            };
            return inEditMode
                ? res.redirect("check-your-details")
                : res.redirect(nsa_navigator_1.default.getNextPage(req));
        };
        this.getBackLink = (req) => {
            if (!req.session.journey) {
                throw Error("TranslatorController::getBackLink: No journey set");
            }
            const { inEditMode } = req.session.journey;
            return inEditMode
                ? "check-your-details"
                : nsa_navigator_1.default.getPreviousPage(req);
        };
        /* istanbul ignore next */
        this.postSchemaValidation = {
            translator: {
                in: ["body"],
                isEmpty: {
                    negated: true,
                    errorMessage: () => language_1.translate("translator.errorMessages.empty"),
                },
                isLength: {
                    errorMessage: () => language_1.translate("translator.errorMessages.tooLong"),
                    options: {
                        max: 100,
                    },
                },
            },
        };
    }
    renderPage(req, res) {
        var _a;
        if (!req.session.currentBooking) {
            throw Error("TranslatorController::renderPage: No currentBooking set");
        }
        const { translator } = req.session.currentBooking;
        return res.render("supported/translator", {
            value: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.translator) || translator,
            backLink: this.getBackLink(req),
            errors: req.errors,
        });
    }
}
exports.TranslatorController = TranslatorController;
exports.default = new TranslatorController();
