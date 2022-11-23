import { Request, Response, NextFunction } from 'express'
import { validateRequest, ValidatorSchema } from "../../../src/middleware/request-validator";

export interface RequestAndResponse {
    req: Request,
    res: Response
}

// Attempt at manually chaining form validation middleware for a given request, response and validation schema
export async function validate(req : Request, res: Response, schema : ValidatorSchema): Promise<RequestAndResponse> {
    const validationFunctions = validateRequest(schema); // Returns 3 functions (that express chains together in router methods to perform validation), in positions [0][0], [0][1], and [1]
    const validationFunction1 = validationFunctions[0][0]; // async function
    const validationFunction2 = validationFunctions[0][1]; // async function
    const validationFunction3 = validationFunctions[1];

    let finalReq: Request = req, finalRes: Response = res;


    const nextFunction1 = async (req: Request, res: Response, next: NextFunction) => {
        console.log("1: ", req, res) // Prints '1:  undefined undefined'
        await validationFunction2(req, res, nextFunction2);
    }
       

    const nextFunction2 = (req: Request, res: Response, next: NextFunction) => {
        console.log("2: ", req, res)
        validationFunction3(req, res, nextFunction3)
    }

    const nextFunction3 = (req: Request, res: Response) => { 
        console.log("3: ", req, res)
        finalReq = req; 
        finalRes = res; 
    }

    console.log("0: ", req, res) // Correctly prints contents of req and res
    await validationFunction1(req, res, nextFunction1); // Function has call to next

    return { req: finalReq, res: finalRes };
}