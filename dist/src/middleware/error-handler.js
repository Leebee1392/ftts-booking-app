"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorHandler = exports.internalServerError = exports.pageNotFound = void 0;
const egress_filtering_1 = require("@dvsa/egress-filtering");
const logger_1 = require("../helpers/logger");
function pageNotFound(req, res) {
    res.status(404);
    logger_1.logger.info(`errorHandler::pageNotFound: ERROR 404: ${req.path}`, {
        path: req.path,
    });
    return res.render("error404", { errors: true });
}
exports.pageNotFound = pageNotFound;
// This has been ignored because the express error handler requires all four parameters defined below.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function internalServerError(err, req, res, next) {
    res.status(500);
    if (err instanceof egress_filtering_1.InternalAccessDeniedError) {
        logger_1.logger.security("errorHandler::internalServerError: url is not whitelisted so it cannot be called", {
            host: err.host,
            port: err.port,
            reason: JSON.stringify(err),
        });
        logger_1.logger.event(logger_1.BusinessTelemetryEvents.NOT_WHITELISTED_URL_CALL, err.message, {
            host: err.host,
            port: err.port,
        });
    }
    else {
        logger_1.logger.error(err, "errorHandler::internalServerError: error caught", {
            errorMessage: err.message,
        });
    }
    return res.render("error500", { errors: true });
}
exports.internalServerError = internalServerError;
function asyncErrorHandler(handler) {
    return async (req, res, next) => {
        try {
            return await handler(req, res, next);
        }
        catch (err) {
            return internalServerError(err, req, res, () => { });
        }
    };
}
exports.asyncErrorHandler = asyncErrorHandler;
