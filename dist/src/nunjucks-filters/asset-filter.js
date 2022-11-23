"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetFilter = void 0;
const config_1 = __importDefault(require("../config"));
class AssetFilter {
    static asset(path) {
        return `${config_1.default.view.assetPath}/${path}?v=${config_1.default.buildVersion}`;
    }
}
exports.AssetFilter = AssetFilter;
