"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGoogleAnalyticsId = void 0;
const config_1 = __importDefault(require("../config"));
const setGoogleAnalyticsId = (req, res, next) => {
    res.locals.googleAnalyticsMeasurementId =
        config_1.default.googleAnalytics.measurementId;
    res.locals.googleAnalyticsBaseUrl = config_1.default.googleAnalytics.url;
    return next();
};
exports.setGoogleAnalyticsId = setGoogleAnalyticsId;
