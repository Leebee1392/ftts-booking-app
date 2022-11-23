"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanceFilter = void 0;
class DistanceFilter {
    static formatDistance(num) {
        if (num > 10) {
            return num.toFixed(0);
        }
        return Number(num.toFixed(1)).toString();
    }
    static milesToKilometres(num) {
        return num * 1.609;
    }
}
exports.DistanceFilter = DistanceFilter;
