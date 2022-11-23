"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAnalyticsCookie = void 0;
const cookie_helper_1 = require("../helpers/cookie-helper");
const setAnalyticsCookie = (req, res, next) => {
    var _a, _b, _c, _d, _e;
    const acceptLabel = "accept";
    const rejectLabel = "reject";
    res.locals.cookiePreferenceSet = false;
    res.locals.cookiesEnabled = false;
    if (((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.cookies) === acceptLabel &&
        ((_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.cookies) !== undefined) {
        cookie_helper_1.setCookieHeader(res, "cm-user-preferences", acceptLabel, {
            maxAge: 31536000,
            httpOnly: true,
            secure: true,
        });
        res.locals.cookiePreferenceSet = true;
        res.locals.cookiesEnabled = true;
    }
    else if (((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.cookies) === rejectLabel &&
        ((_d = req === null || req === void 0 ? void 0 : req.query) === null || _d === void 0 ? void 0 : _d.cookies) !== undefined) {
        cookie_helper_1.setCookieHeader(res, "cm-user-preferences", rejectLabel, {
            maxAge: 0,
            httpOnly: true,
            secure: true,
        });
        res.locals.cookiePreferenceSet = true;
        res.locals.cookiesEnabled = false;
    }
    if (req.cookies["cm-user-preferences"] === acceptLabel &&
        !res.locals.cookiePreferenceSet) {
        // Check if we still have cookies enabled or not if we haven't changed preferences in this request.
        res.locals.cookiesEnabled = true;
    }
    if (((_e = req === null || req === void 0 ? void 0 : req.query) === null || _e === void 0 ? void 0 : _e.viewCookies) === "redirect") {
        return res.redirect("/view-cookies");
    }
    return next();
};
exports.setAnalyticsCookie = setAnalyticsCookie;
