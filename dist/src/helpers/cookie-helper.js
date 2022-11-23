"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAzureCookie = exports.setCookieHeader = void 0;
const cookie_1 = require("cookie");
const setCookieHeader = (res, cookieName, cookieValue, cookieOptions) => {
    // Create Cookie
    const cookie = cookie_1.serialize(cookieName, cookieValue, cookieOptions);
    // Get current 'Set Cookie' Header and amend it
    const previous = res.getHeader("Set-Cookie") || [];
    const header = Array.isArray(previous)
        ? previous.concat(cookie)
        : [previous, cookie];
    res.setHeader("Set-Cookie", header);
};
exports.setCookieHeader = setCookieHeader;
const createAzureCookie = (cookieString) => {
    const parsedCookie = cookie_1.parse(cookieString);
    // Required Fields
    const name = Object.keys(parsedCookie)[0];
    const value = Object.values(parsedCookie)[0];
    // Optional Fields
    const domain = getValueFromParsedCookie(parsedCookie, "domain");
    const path = getValueFromParsedCookie(parsedCookie, "path");
    const expiryDateString = getValueFromParsedCookie(parsedCookie, "expires");
    const expires = expiryDateString ? new Date(expiryDateString) : undefined;
    const maxAgeString = getValueFromParsedCookie(parsedCookie, "max-age");
    const maxAge = maxAgeString ? Number(maxAgeString) : undefined;
    const sameSite = getValueFromParsedCookie(parsedCookie, "samesite");
    const secure = cookieString.toLowerCase().includes("secure");
    const httpOnly = cookieString.toLowerCase().includes("httponly");
    return {
        name,
        value,
        domain,
        path,
        expires,
        maxAge,
        sameSite,
        httpOnly,
        secure,
    };
};
exports.createAzureCookie = createAzureCookie;
const getValueFromParsedCookie = (parsedCookie, searchTerm) => {
    const validKey = Object.keys(parsedCookie).find((key) => key.toLowerCase() === searchTerm.toLowerCase());
    return validKey ? parsedCookie[`${validKey}`] : undefined;
};
