"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRN = void 0;
const logger_1 = require("../helpers/logger");
const enums_1 = require("./enums");
class PRN {
    static isValid(prn, { req }) {
        var _a;
        return PRN.isPRNValid(prn, ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.target) || enums_1.Target.GB);
    }
    static isPRNValid(prn, target) {
        if (prn === undefined) {
            throw new Error("PRN is undefined");
        }
        if (prn.trim().length <= 0) {
            throw new Error("PRN is empty");
        }
        if (target === enums_1.Target.NI) {
            if (prn.trim().length > 16) {
                logger_1.logger.debug("PRN:isPRNValid PRN is invalid", {
                    target,
                    prnLength: prn.trim(),
                });
                throw new Error("PRN is invalid");
            }
        }
        if (target === enums_1.Target.GB) {
            if (prn.trim().length > 6) {
                logger_1.logger.debug("PRN:isPRNValid PRN is invalid", {
                    target,
                    prnLength: prn.trim(),
                });
                throw new Error("PRN is invalid");
            }
        }
        if (!/^\d+$/.test(prn.trim())) {
            logger_1.logger.debug("PRN:isPRNValid PRN is invalid", {
                target,
                prnLength: prn.trim(),
            });
            throw new Error("PRN is invalid");
        }
        return true;
    }
}
exports.PRN = PRN;
