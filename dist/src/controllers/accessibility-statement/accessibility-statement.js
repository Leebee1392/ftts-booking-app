"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityStatementController = void 0;
class AccessibilityStatementController {
    constructor() {
        this.get = (req, res) => {
            var _a, _b;
            if (!((_a = req.headers.referer) === null || _a === void 0 ? void 0 : _a.match(/accessibility-statement/))) {
                req.session.lastPage = ((_b = req.headers.referer) === null || _b === void 0 ? void 0 : _b.split("?")[0]) || "/";
            }
            return res.render("common/accessibility-statement", {
                backLink: req.session.lastPage,
            });
        };
    }
}
exports.AccessibilityStatementController = AccessibilityStatementController;
exports.default = new AccessibilityStatementController();
