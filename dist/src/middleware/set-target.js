"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTarget = void 0;
const enums_1 = require("../domain/enums");
const language_1 = require("../helpers/language");
const session_1 = require("../services/session");
const setTarget = async (req, res, next) => {
    var _a;
    if (req.query.target &&
        Object.values(enums_1.Target).includes(req.query.target) &&
        !((_a = req.session.journey) === null || _a === void 0 ? void 0 : _a.inEditMode)) {
        session_1.store.reset(req);
        req.session.target = req.query.target;
        res.locals.target = req.query.target;
        if ((req.query.lang || req.session.locale) &&
            !language_1.isLocaleAvailableForTarget(req.query.lang
                ? req.query.lang
                : req.session.locale, req.query.target)) {
            language_1.resetLocale(req);
            await language_1.changeLanguage(req, res);
        }
    }
    return next();
};
exports.setTarget = setTarget;
