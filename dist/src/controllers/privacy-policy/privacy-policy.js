"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyPolicyController = void 0;
class PrivacyPolicyController {
    constructor() {
        this.get = (req, res) => {
            var _a, _b;
            if (!((_a = req.headers.referer) === null || _a === void 0 ? void 0 : _a.match(/privacy-policy/))) {
                req.session.lastPage = ((_b = req.headers.referer) === null || _b === void 0 ? void 0 : _b.split("?")[0]) || "/";
            }
            res.render("common/privacy-policy", {
                backLink: req.session.lastPage,
            });
        };
    }
}
exports.PrivacyPolicyController = PrivacyPolicyController;
exports.default = new PrivacyPolicyController();
