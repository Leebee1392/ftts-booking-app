"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSession = void 0;
const uuid_1 = require("uuid");
const enums_1 = require("../domain/enums");
const setupSession = (req, res, next) => {
    if (!req.session.init) {
        req.session.init = true;
        req.session.journey = {
            inEditMode: false,
            inManagedBookingEditMode: false,
            managedBookingRescheduleChoice: "",
        };
        req.session.target = req.session.target || enums_1.Target.GB;
        req.session.locale = req.session.locale || enums_1.Locale.GB;
        req.session.sessionId = req.session.sessionId || uuid_1.v4();
    }
    if (req.session.journey && !req.originalUrl.startsWith("/instructor")) {
        req.session.journey.isInstructor = false;
    }
    return next();
};
exports.setupSession = setupSession;
