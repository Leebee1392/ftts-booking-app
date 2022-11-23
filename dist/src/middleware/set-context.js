"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContext = void 0;
const enums_1 = require("../domain/enums");
const setContext = (req, res, next) => {
    if (req.query.context) {
        req.session.context =
            req.query.context === enums_1.Context.INSTRUCTOR
                ? enums_1.Context.INSTRUCTOR
                : enums_1.Context.CITIZEN;
    }
    return next();
};
exports.setContext = setContext;
