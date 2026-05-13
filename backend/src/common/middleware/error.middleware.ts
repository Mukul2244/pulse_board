import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/api-error.js";

export default function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || null,
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}