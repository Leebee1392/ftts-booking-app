"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialiseExpressHttpContextProvider = void 0;
const config_1 = __importDefault(require("../../config"));
const cookie_helper_1 = require("../../helpers/cookie-helper");
function initialiseExpressHttpContextProvider(req, res) {
    return {
        getHttpRequest() {
            return {
                getUserAgent() {
                    return this.getHeader("user-agent");
                },
                getHeader(headerName) {
                    const headerValue = req.header(headerName);
                    if (!headerValue) {
                        return "";
                    }
                    return headerValue;
                },
                getAbsoluteUri() {
                    return `${req.protocol}://${config_1.default.queueit.redirectUrl}${req.originalUrl}`;
                },
                getUserHostAddress() {
                    return req.ip;
                },
                getCookieValue(cookieKey) {
                    // This requires 'cookie-parser' node module (installed/used from app.js)
                    // eslint-disable-next-line security/detect-object-injection
                    return req.cookies[cookieKey];
                },
                getRequestBodyAsString() {
                    return "NotUsed";
                },
            };
        },
        getHttpResponse() {
            return {
                setCookie(cookieName, cookieValue, domain, expiration) {
                    cookie_helper_1.setCookieHeader(res, cookieName, cookieValue, {
                        expires: new Date(expiration * 1000),
                        path: "/",
                        domain: domain === "" ? undefined : domain,
                        secure: true,
                        httpOnly: true,
                    });
                },
            };
        },
    };
}
exports.initialiseExpressHttpContextProvider = initialiseExpressHttpContextProvider;
