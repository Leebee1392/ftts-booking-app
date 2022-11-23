"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internationalisation = void 0;
const enums_1 = require("../domain/enums");
const language_1 = require("../helpers/language");
const internationalisation = async (req, res, next) => {
    if (!req.session.locale) {
        language_1.resetLocale(req);
    }
    if (req.query.lang &&
        Object.values(enums_1.Locale).includes(req.query.lang) &&
        language_1.isLocaleAvailableForTarget(req.query.lang, req.query.target
            ? req.query.target
            : req.session.target)) {
        req.session.locale = req.query.lang;
    }
    await language_1.changeLanguage(req, res);
    return next();
};
exports.internationalisation = internationalisation;
