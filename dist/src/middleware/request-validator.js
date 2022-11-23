"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionalValidateRequest = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
function processValidationResults(req, res, next) {
    const errors = express_validator_1.validationResult(req);
    req.errors = errors.array();
    console.log(req.errors);
    req.hasErrors = req.errors.length > 0;
    setResponseStatus(req, res);
    next();
}
function setResponseStatus(req, res) {
    if (req.hasErrors) {
        res.status(400);
    }
}
// Seems to be a type incompatibility issue when passing this in the express routers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateRequest(validationSchema) {
    const requestValidationChain = [];
    requestValidationChain.push(express_validator_1.checkSchema(validationSchema));
    console.log("\n\n" + requestValidationChain.concat(processValidationResults));
    return requestValidationChain.concat(processValidationResults);
}
exports.validateRequest = validateRequest;
// For validating against dynamically-generated schema based on request
function conditionalValidateRequest(buildSchema) {
    return async (req, res, next) => {
        const validations = express_validator_1.checkSchema(buildSchema(req));
        await Promise.all(validations.map((val) => val.run(req)));
        return processValidationResults(req, res, next);
    };
}
exports.conditionalValidateRequest = conditionalValidateRequest;
