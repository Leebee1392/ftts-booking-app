"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramValueOf = void 0;
function paramValueOf(name, targetValue, defaultValue) {
    return (source) => {
        if (source[`${name}`]) {
            return targetValue(source[`${name}`]);
        }
        return defaultValue();
    };
}
exports.paramValueOf = paramValueOf;
