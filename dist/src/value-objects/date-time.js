"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = void 0;
const string_value_1 = require("./string-value");
class DateTime extends string_value_1.StringValue {
    constructor(value) {
        super();
        this.value = new Date(value);
    }
    static from(value) {
        if (!this.isValidDate(value)) {
            throw new TypeError("This is not a valid format for a timestamp");
        }
        return new DateTime(value);
    }
    static isValidDate(value) {
        try {
            return new Date(value).toISOString() === value;
        }
        catch (e) {
            return false;
        }
    }
    toString() {
        return this.value.toISOString();
    }
}
exports.DateTime = DateTime;
