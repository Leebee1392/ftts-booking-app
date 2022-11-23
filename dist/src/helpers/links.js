"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStartAgainLink = exports.getErrorPageLink = void 0;
const enums_1 = require("../domain/enums");
const language_1 = require("./language");
const getErrorPageLink = (dest, req) => {
    var _a, _b, _c;
    let sourcePath = "/";
    const target = ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.target) === enums_1.Target.NI ? enums_1.Target.NI : enums_1.Target.GB;
    const locale = ((_b = req === null || req === void 0 ? void 0 : req.session) === null || _b === void 0 ? void 0 : _b.locale) ? (_c = req === null || req === void 0 ? void 0 : req.session) === null || _c === void 0 ? void 0 : _c.locale : enums_1.Locale.GB;
    const lang = language_1.sanitizeLocale(locale);
    const path = req === null || req === void 0 ? void 0 : req.originalUrl;
    if (path) {
        if (path.startsWith("/manage-booking")) {
            sourcePath = "/manage-booking";
        }
        else if (path.startsWith("/instructor")) {
            sourcePath = "/instructor";
        }
    }
    return `${dest}?source=${sourcePath}&target=${target}&lang=${lang}`;
};
exports.getErrorPageLink = getErrorPageLink;
const getStartAgainLink = (target, lang, source) => {
    let startAgainLink = `/choose-support?target=${target}&lang=${lang}`;
    if (source === null || source === void 0 ? void 0 : source.startsWith("/manage-booking")) {
        startAgainLink = `/manage-booking?target=${target}&lang=${lang}`;
    }
    else if (source === null || source === void 0 ? void 0 : source.startsWith("/instructor")) {
        startAgainLink = `/instructor?target=${target}&lang=${lang}`;
    }
    return startAgainLink;
};
exports.getStartAgainLink = getStartAgainLink;
