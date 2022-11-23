"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const nonceCreator = (req, res) => `'nonce-${res.locals.scriptNonce}'`;
// Helmet does not export the config type - This is the way the recommend getting it on GitHub.
const helmetConfiguration = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                config_1.default.view.assetDomain || "'self'",
                "'unsafe-inline'",
                "*.googleapis.com",
            ],
            scriptSrc: [
                config_1.default.view.assetDomain,
                "'self'",
                nonceCreator,
                "https://*.googleapis.com",
                "https://*.google-analytics.com",
                "https://*.analytics.google.com",
                "https://*.queue-it.net",
                "https://*.googletagmanager.com",
            ],
            connectSrc: [
                "'self'",
                config_1.default.view.assetDomain,
                "https://*.google-analytics.com",
                "https://*.analytics.google.com",
                "https://*.googletagmanager.com",
                "https://*.queue-it.net",
                "https://*.googleapis.com",
            ],
            imgSrc: [
                config_1.default.view.assetDomain || "'self'",
                "maps.gstatic.com",
                "*.googleapis.com",
                "*.google-analytics.com",
                "*.analytics.google.com",
                "data:",
                "*.googletagmanager.com",
            ],
            fontSrc: [config_1.default.view.assetDomain || "'self'", "fonts.gstatic.com"],
        },
    },
    dnsPrefetchControl: {
        allow: false,
    },
    frameguard: {
        action: "deny",
    },
    hsts: {
        maxAge: 31536000,
        preload: false,
        includeSubDomains: true,
    },
    referrerPolicy: false,
    permittedCrossDomainPolicies: false,
    expectCt: false,
};
exports.default = helmetConfiguration;
