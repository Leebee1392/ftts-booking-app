"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalErrorController = void 0;
const enums_1 = require("../../domain/enums");
const language_1 = require("../../helpers/language");
const links_1 = require("../../helpers/links");
const session_1 = require("../../services/session");
class TechnicalErrorController {
    constructor() {
        this.get = async (req, res) => {
            var _a, _b;
            session_1.store.reset(req, res);
            const target = ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.target) === enums_1.Target.NI ? enums_1.Target.NI : enums_1.Target.GB;
            res.locals.target = target;
            const lang = await language_1.setCorrectLanguage(req, res, target);
            const source = String((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.source);
            return res.render("common/error-technical", {
                startAgainLink: links_1.getStartAgainLink(target, lang, source),
            });
        };
    }
}
exports.TechnicalErrorController = TechnicalErrorController;
exports.default = new TechnicalErrorController();
