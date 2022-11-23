"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardAuth = void 0;
const session_helper_1 = require("../../helpers/session-helper");
const common_auth_1 = require("./common-auth");
const standardAuth = (req, res, next) => {
    var _a, _b, _c, _d;
    if (common_auth_1.checkCommonAuth(req) &&
        ((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.journey) === null || _b === void 0 ? void 0 : _b.standardAccommodation) &&
        !((_d = (_c = req.session) === null || _c === void 0 ? void 0 : _c.journey) === null || _d === void 0 ? void 0 : _d.isInstructor)) {
        return next();
    }
    return res.redirect(session_helper_1.getTimeoutErrorPath(req));
};
exports.standardAuth = standardAuth;
