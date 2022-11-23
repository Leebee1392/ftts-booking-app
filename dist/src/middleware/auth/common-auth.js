"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonAuth = exports.checkCommonAuth = void 0;
const session_helper_1 = require("../../helpers/session-helper");
const checkCommonAuth = (req) => { var _a; return Boolean((_a = req.session) === null || _a === void 0 ? void 0 : _a.candidate); };
exports.checkCommonAuth = checkCommonAuth;
const commonAuth = (req, res, next) => {
    if (exports.checkCommonAuth(req)) {
        return next();
    }
    return res.redirect(session_helper_1.getTimeoutErrorPath(req));
};
exports.commonAuth = commonAuth;
