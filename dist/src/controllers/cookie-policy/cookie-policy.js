"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookiePolicyController = void 0;
class CookiePolicyController {
    constructor() {
        this.get = (req, res) => {
            var _a, _b;
            if (!((_a = req.headers.referer) === null || _a === void 0 ? void 0 : _a.match(/view-cookies/))) {
                req.session.lastPage = ((_b = req.headers.referer) === null || _b === void 0 ? void 0 : _b.split("?")[0]) || "/";
            }
            return res.render("cookie-policy", {
                cookiePageBackLink: req.session.lastPage,
                onPolicyPage: true,
            });
        };
    }
}
exports.CookiePolicyController = CookiePolicyController;
exports.default = new CookiePolicyController();
