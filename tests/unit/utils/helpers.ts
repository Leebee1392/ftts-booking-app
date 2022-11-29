import { Request, Response, NextFunction } from 'express'
import { validateRequest, ValidatorSchema } from "../../../src/middleware/request-validator";

export interface RequestAndResponse {
    req: Request,
    res: Response
}

export async function validate(req : Request, res: Response, schema : ValidatorSchema): Promise<RequestAndResponse> {

    const validationFunctions = validateRequest(schema); // Returns 3 middlewares - (that express chains together in router methods to perform validation), in positions [0][0], [0][1], and [1]

    console.log("a" + validationFunctions);

    // Chain the asynchronous middlewares
    await Promise.all(validationFunctions[0].map( async (middleware: any) => {
        await middleware(req, res, () => undefined);
    }));

    // Run processValidationResults
    validationFunctions[1](req, res, () => undefined);

    return { req, res };
}