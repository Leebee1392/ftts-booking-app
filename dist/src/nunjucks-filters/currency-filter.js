"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyFilter = void 0;
const config_1 = __importDefault(require("../config"));
class CurrencyFilter {
    static formatPrice(num) {
        return config_1.default.currencySymbol + num.toFixed(2);
    }
}
exports.CurrencyFilter = CurrencyFilter;
