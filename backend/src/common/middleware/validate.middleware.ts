import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.js";

const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.flatten();

            throw ApiError.badRequest("Invalid input data", errors);
        }

        req.body = result.data;

        next();
    };
};

export default validate;