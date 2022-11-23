"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertNullUndefinedToEmptyString = void 0;
const convertNullUndefinedToEmptyString = (field) => {
    if (field) {
        return field;
    }
    return "";
};
exports.convertNullUndefinedToEmptyString = convertNullUndefinedToEmptyString;
