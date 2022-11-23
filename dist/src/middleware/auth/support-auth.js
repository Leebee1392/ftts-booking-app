"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportAuth = void 0;
const session_helper_1 = require("../../helpers/session-helper");
const common_auth_1 = require("./common-auth");
const supportAuth = (req, res, next) => {
    var _a, _b;
    if (common_auth_1.checkCommonAuth(req) && ((_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.journey) === null || _b === void 0 ? void 0 : _b.support)) {
        return next();
    }
    return res.redirect(session_helper_1.getTimeoutErrorPath(req));
};
exports.supportAuth = supportAuth;
