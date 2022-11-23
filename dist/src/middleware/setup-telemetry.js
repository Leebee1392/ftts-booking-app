"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTelemetry = void 0;
const cls_hooked_1 = require("cls-hooked");
const namespace = cls_hooked_1.createNamespace("app");
const setupTelemetry = (req, res, next) => {
    namespace.run(() => {
        var _a, _b, _c;
        namespace.set("sessionId", (_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.sessionId);
        namespace.set("X-Azure-Ref", (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b["x-azure-ref"]);
        namespace.set("INCAP-REQ-ID", (_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c["incap-req-id"]);
        return next();
    });
};
exports.setupTelemetry = setupTelemetry;
