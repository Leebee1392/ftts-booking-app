"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_ADDRESSES = void 0;
const egress_filtering_1 = require("@dvsa/egress-filtering");
const config_1 = __importDefault(require("../../config"));
exports.ALLOWED_ADDRESSES = [
    egress_filtering_1.addressParser.parseUri(config_1.default.crm.apiUrl),
    egress_filtering_1.addressParser.parseUri(config_1.default.location.baseUrl),
    egress_filtering_1.addressParser.parseUri(config_1.default.notification.baseUrl),
    egress_filtering_1.addressParser.parseUri(config_1.default.payment.baseUrl),
    egress_filtering_1.addressParser.parseUri(config_1.default.scheduling.baseUrl),
    egress_filtering_1.addressParser.parseUri(config_1.default.eligibility.baseUrl),
    egress_filtering_1.addressParser.parseUri(config_1.default.googleAnalytics.url),
];
