"use strict";
/* eslint-disable security/detect-non-literal-regexp */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupQueueIt = void 0;
const queueit_knownuser_1 = require("queueit-knownuser");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../config"));
const enums_1 = require("../../domain/enums");
const logger_1 = require("../../helpers/logger");
const queue_it_helper_1 = require("./queue-it-helper");
const setupQueueIt = (req, res, next) => {
    if (config_1.default.queueit.enabled === enums_1.QueueItImplementation.KnownUser) {
        setupQueueItKnownUser(req, res, next);
    }
    else if (config_1.default.queueit.enabled === enums_1.QueueItImplementation.JSImplementation) {
        setupQueueItJSImplementation(req, res, next);
    }
    else {
        next();
    }
};
exports.setupQueueIt = setupQueueIt;
/**
 * **QueueIt Server Side Implementation**
 * Controlled by the constant: { QueueItImplementation.KnownUser }
 *
 * This method is used to support the QueueIt server side implementation. It works in the following way:
 * 1. Firstly we create a {RequestValidationResult} to check the session is valid with QueueIt
 * 2. When {RequestValidationResult} is NOT valid we will redirect the user to the url provided by QueueIt and place them in the Queue
 * 3. When {RequestValidationResult} is valid we will redirect the user to the requested url
 */
const setupQueueItKnownUser = (req, res, next) => {
    try {
        //  HTTP Provider
        const httpContextProvider = queue_it_helper_1.initialiseExpressHttpContextProvider(req, res);
        //  Setup
        configureKnownUserHashing();
        const queueConfig = new queueit_knownuser_1.QueueEventConfig(config_1.default.queueit.eventId, config_1.default.queueit.layoutName, config_1.default.queueit.culture, config_1.default.queueit.queueDomain, config_1.default.queueit.extendCookieValidity, config_1.default.queueit.cookieValidityMinute, config_1.default.queueit.cookieDomain, config_1.default.queueit.version);
        // Get Token from Request Query String;
        const token = req.query[queueit_knownuser_1.KnownUser.QueueITTokenKey];
        // Defining Response Url to use when QueueIt has been confirmed
        const requestUrl = httpContextProvider.getHttpRequest().getAbsoluteUri();
        const requestUrlWithoutToken = requestUrl.replace(new RegExp(`([?&])(${queueit_knownuser_1.KnownUser.QueueITTokenKey}=[^&]*)`, "i"), "");
        // Creating Validation
        const result = queueit_knownuser_1.KnownUser.resolveQueueRequestByLocalConfig(requestUrlWithoutToken, token, queueConfig, config_1.default.queueit.customerId, config_1.default.queueit.secretKey, httpContextProvider);
        //  Validates whether a redirect is required to the Queue It service
        if (result.doRedirect()) {
            logger_1.logger.debug("setupQueueItKnownUser:: Redirecting Candidate to the QueueIt Service", { redirectUrl: result.redirectUrl });
            res.set({
                "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
                Pragma: "no-cache",
                Expires: "Fri, 01 Jan 1990 00:00:00 GMT",
            });
            res.redirect(result.redirectUrl);
            return;
        }
        //  Checks if current request url contains the Queue It token and removes it
        if (requestUrl !== requestUrlWithoutToken &&
            result.actionType === "Queue") {
            logger_1.logger.debug("setupQueueItKnownUser:: Removing Queue It Token and Redirecting", { requestedUrl: requestUrlWithoutToken });
            // Hide the token from queue it in the query string
            res.redirect(requestUrlWithoutToken);
            return;
        }
        logger_1.logger.debug("setupQueueItKnownUser:: Request does not contain Queue It token and can continue", { requestedUrl: requestUrlWithoutToken });
        next();
    }
    catch (err) {
        logger_1.logger.error(err, "setupQueueItKnownUser:: Error");
        throw err;
    }
};
/**
 * **QueueIt JS Implementation**
 * Controlled by the constant: { queueItImplementation.JSImplementation }
 */
const setupQueueItJSImplementation = (req, res, next) => {
    res.locals.queueItCustomerId = config_1.default.queueit.customerId;
    res.locals.queueItImplementation = enums_1.QueueItImplementation.JSImplementation;
    next();
};
/**
 * Defines the implementation of QueueIt SHA256 hashing function
 */
function configureKnownUserHashing() {
    queueit_knownuser_1.Utils.generateSHA256Hash = (secretKey, stringToHash) => {
        const hash = crypto_1.default
            .createHmac("sha256", secretKey)
            .update(stringToHash)
            .digest("hex");
        return hash;
    };
}
