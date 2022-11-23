"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XRobotsTagFilter = void 0;
// Prevent search indexing
class XRobotsTagFilter {
    static filter(req, res, next) {
        // Setting headers stops pages being indexed even if indexed pages link to them.
        res.setHeader("X-Robots-Tag", "noindex");
        next();
    }
}
exports.XRobotsTagFilter = XRobotsTagFilter;
