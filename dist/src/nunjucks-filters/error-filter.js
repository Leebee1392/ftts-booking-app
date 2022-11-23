"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFilter = void 0;
class ErrorFilter {
    static existsAsAnErrorIn(fieldName, errors) {
        if (errors === undefined) {
            return false;
        }
        return errors.some((err) => err.param === fieldName);
    }
    static fieldErrorMessage(fieldName, errors) {
        if (errors === undefined) {
            return "";
        }
        const errorsForParam = errors.filter((err) => err.param === fieldName);
        if (errorsForParam.length === 0) {
            return "";
        }
        return errorsForParam[0].msg || "";
    }
    static fieldErrorObject(fieldName, errors) {
        if (!errors) {
            return undefined;
        }
        const errorsForParam = errors.filter((err) => err.param === fieldName);
        if (!errorsForParam.length || !errorsForParam[0].msg.length) {
            return undefined;
        }
        return {
            text: errorsForParam[0].msg,
        };
    }
}
exports.ErrorFilter = ErrorFilter;
