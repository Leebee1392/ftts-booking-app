"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noCache = void 0;
function noCache(req, res, next) {
    res.setHeader("Surrogate-Control", "no-store");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", 0);
    return next();
}
exports.noCache = noCache;
