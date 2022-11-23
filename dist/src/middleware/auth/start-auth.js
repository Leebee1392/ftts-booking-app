"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAuth = void 0;
const session_helper_1 = require("../../helpers/session-helper");
const startAuth = (req, res, next) => {
    var _a, _b;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.journey) {
        if (!((_b = req.session) === null || _b === void 0 ? void 0 : _b.candidate) || req.session.journey.inEditMode) {
            return next();
        }
    }
    return res.redirect(session_helper_1.getTimeoutErrorPath(req));
};
exports.startAuth = startAuth;
