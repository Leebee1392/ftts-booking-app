"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLocals = void 0;
const config_1 = __importDefault(require("../config"));
const enums_1 = require("../domain/enums");
const journey_helper_1 = require("../helpers/journey-helper");
const session_helper_1 = require("../helpers/session-helper");
const setupLocals = (req, res, next) => {
    const { journey, target, locale } = req.session;
    let inEditMode;
    let standardAccommodation;
    let inSupportMode;
    let inManageBookingMode;
    let isInstructor;
    let journeyName;
    if (journey) {
        inEditMode = Boolean(journey.inEditMode);
        standardAccommodation = Boolean(journey.standardAccommodation);
        inSupportMode = Boolean(journey.support);
        inManageBookingMode = Boolean(journey.inManageBookingMode);
        journeyName = journey_helper_1.getJourneyName(journey);
        isInstructor = journey.isInstructor;
    }
    let headerLink = config_1.default.landing.gb.citizen.book;
    if (locale === enums_1.Locale.CY) {
        headerLink = config_1.default.landing.cy.citizen.book;
    }
    const sessionInfo = session_helper_1.getSessionExpiryInfo(req);
    res.locals = {
        ...res.locals,
        target: target || enums_1.Target.GB,
        imgRoot: target === enums_1.Target.NI ? "images/ni/" : "images/",
        inEditMode,
        standardAccommodation,
        inSupportMode,
        inManageBookingMode,
        ...sessionInfo,
        source: req.path,
        headerLink,
        journeyName,
        organisation: req.session.target === enums_1.Target.NI ? "dva" : "dvsa",
        isInstructor,
    };
    return next();
};
exports.setupLocals = setupLocals;
