"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YesOrNo = void 0;
const enums_1 = require("../domain/enums");
class YesOrNo {
    constructor(value) {
        this.value = value;
    }
    static from(value) {
        if (!YesOrNo.isYesOrNo(value)) {
            throw new TypeError("Please choose yes or no.");
        }
        return new YesOrNo(value);
    }
    static fromBoolean(bool) {
        if (bool !== true && bool !== false) {
            throw new TypeError("The value provided is not of type boolean.");
        }
        const yesOrNo = bool ? enums_1.YesNo.YES : enums_1.YesNo.NO;
        return new YesOrNo(yesOrNo);
    }
    static isValid(value) {
        return YesOrNo.from(value) instanceof YesOrNo;
    }
    static isYesOrNo(value) {
        return value !== undefined && (value === "yes" || value === "no");
    }
    toString() {
        return this.value;
    }
}
exports.YesOrNo = YesOrNo;
