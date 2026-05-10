import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "@/common/utils/api-error";

export function restrictToAuthenticatedUser() {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(ApiError.unauthorized("Authentication required"));
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            (req as any).user = decoded;
            next();
        } catch (error) {
            return next(ApiError.unauthorized("Invalid token"));
        }
    };
}

// Ensure error handler receives api error
