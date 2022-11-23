"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCorrectLanguage = exports.sanitizeLocale = exports.resetLocale = exports.getDefaultLocale = exports.isLocaleAvailableForTarget = exports.translate = exports.changeLanguageToLocale = exports.changeLanguage = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const cy_1 = __importDefault(require("dayjs/locale/cy"));
const en_gb_1 = __importDefault(require("dayjs/locale/en-gb"));
const i18next_1 = __importDefault(require("i18next"));
const enums_1 = require("../domain/enums");
const config_1 = __importDefault(require("../config"));
const logger_1 = require("./logger");
const changeLanguage = async (req, res) => {
    var _a;
    const locale = ((_a = req.session) === null || _a === void 0 ? void 0 : _a.locale) || enums_1.Locale.GB;
    await exports.changeLanguageToLocale(req, res, locale);
};
exports.changeLanguage = changeLanguage;
const changeLanguageToLocale = async (req, res, locale) => {
    if (locale === enums_1.Locale.CY) {
        dayjs_1.default.locale(cy_1.default);
        res.locals.htmlLang = "cy";
        res.locals.surveyUrl = config_1.default.survey.cy;
        res.locals.headerLink = config_1.default.landing.cy.citizen.book;
    }
    else {
        dayjs_1.default.locale(en_gb_1.default);
        res.locals.htmlLang = "en";
        res.locals.surveyUrl =
            req.session.locale === enums_1.Locale.NI ? config_1.default.survey.ni : config_1.default.survey.gb;
        res.locals.headerLink = config_1.default.landing.gb.citizen.book;
    }
    try {
        await i18next_1.default.changeLanguage(locale);
    }
    catch (e) {
        logger_1.logger.error(e, "changeLanguageToLocale:: could not change language");
        throw e;
    }
    res.locals.t = i18next_1.default.t.bind(i18next_1.default);
    res.locals.locale = locale;
};
exports.changeLanguageToLocale = changeLanguageToLocale;
const translate = (key) => i18next_1.default.t(key);
exports.translate = translate;
const isLocaleAvailableForTarget = (locale, target) => {
    const availableLocales = enums_1.TARGET_LOCALE_MAP.get(target);
    return (availableLocales === null || availableLocales === void 0 ? void 0 : availableLocales.includes(locale)) || false;
};
exports.isLocaleAvailableForTarget = isLocaleAvailableForTarget;
const getDefaultLocale = (target) => target === enums_1.Target.NI ? enums_1.Locale.NI : enums_1.Locale.GB;
exports.getDefaultLocale = getDefaultLocale;
const resetLocale = (req) => {
    var _a;
    const target = ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.target) ? req.session.target : enums_1.Target.GB;
    const locale = exports.getDefaultLocale(target);
    req.session.locale = locale;
};
exports.resetLocale = resetLocale;
const sanitizeLocale = (locale) => {
    switch (locale) {
        case enums_1.Locale.NI:
            return enums_1.Locale.NI;
        case enums_1.Locale.CY:
            return enums_1.Locale.CY;
        default:
            return enums_1.Locale.GB;
    }
};
exports.sanitizeLocale = sanitizeLocale;
const setCorrectLanguage = async (req, res, target) => {
    var _a;
    const localeInput = ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.lang) ? req.query.lang : enums_1.Locale.GB;
    const locale = exports.sanitizeLocale(localeInput);
    let lang = locale;
    await exports.changeLanguageToLocale(req, res, locale);
    if (!exports.isLocaleAvailableForTarget(locale, target)) {
        const defaultLocale = exports.getDefaultLocale(target);
        lang = defaultLocale;
        await exports.changeLanguageToLocale(req, res, defaultLocale);
    }
    return lang;
};
exports.setCorrectLanguage = setCorrectLanguage;
