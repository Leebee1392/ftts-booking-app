"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NSANavigator = void 0;
const enums_1 = require("../domain/enums");
const support_1 = require("./support");
class NSANavigator {
    constructor() {
        this.dynamicRoutes = [
            {
                option: enums_1.SupportType.VOICEOVER,
                url: "change-voiceover",
            },
            {
                option: enums_1.SupportType.TRANSLATOR,
                url: "translator",
            },
            {
                option: enums_1.SupportType.OTHER,
                url: "custom-support",
            },
        ];
        this.selectedRoutes = [];
        this.getNextPage = (req) => {
            var _a, _b;
            const selectedSupportOptions = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.selectSupportType;
            if (selectedSupportOptions) {
                this.selectedRoutes = this.dynamicRoutes.filter((page) => selectedSupportOptions.includes(page.option));
            }
            const index = this.selectedRoutes
                .map((route) => route.url)
                .indexOf(this.getPathFromUrl(req));
            let targetUrl = (_b = this.selectedRoutes[index + 1]) === null || _b === void 0 ? void 0 : _b.url;
            if (!targetUrl) {
                targetUrl = "staying-nsa";
                if (!selectedSupportOptions ||
                    support_1.isOnlyStandardSupportSelected(selectedSupportOptions)) {
                    targetUrl = "leaving-nsa";
                }
            }
            return targetUrl;
        };
        this.getPreviousPage = (req) => {
            var _a, _b;
            const selectedSupportOptions = (_a = req.session.currentBooking) === null || _a === void 0 ? void 0 : _a.selectSupportType;
            if (selectedSupportOptions) {
                this.selectedRoutes = this.dynamicRoutes.filter((page) => selectedSupportOptions.includes(page.option));
            }
            const routes = [...this.selectedRoutes];
            routes.reverse();
            const index = routes
                .map((route) => route.url)
                .indexOf(this.getPathFromUrl(req));
            let targetUrl = (_b = routes[index + 1]) === null || _b === void 0 ? void 0 : _b.url;
            if (!targetUrl) {
                targetUrl = "select-support-type";
            }
            return targetUrl;
        };
        this.getPathFromUrl = (req) => req.path.substring(req.path.lastIndexOf("/") + 1);
    }
}
exports.NSANavigator = NSANavigator;
exports.default = new NSANavigator();
