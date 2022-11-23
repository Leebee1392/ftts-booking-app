"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageBookingNsaAuth = void 0;
const config_1 = __importDefault(require("../../config"));
const helpers_1 = require("../../helpers");
const manageBookingNsaAuth = (req, res, next) => {
    var _a;
    const featureFlag = config_1.default.featureToggles.enableViewNsaBookingSlots;
    if (((_a = req.session.manageBooking) === null || _a === void 0 ? void 0 : _a.candidate) && featureFlag) {
        // TODO Update to include where the booking will be stored following FTT-19136
        return next();
    }
    return res.redirect(helpers_1.getTimeoutErrorPath(req));
};
exports.manageBookingNsaAuth = manageBookingNsaAuth;
