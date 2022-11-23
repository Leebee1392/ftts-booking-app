"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValue = void 0;
class StringValue {
    static isValid(value) {
        return typeof value === "string" && value.length > 0;
    }
}
exports.StringValue = StringValue;
