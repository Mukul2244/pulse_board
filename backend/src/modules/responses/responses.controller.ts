import { Request, Response, NextFunction } from "express";
import ApiResponse from "@/common/utils/api-response";
import * as responsesService from "./responses.service";
import jwt from "jsonwebtoken";

export async function submitResponse(req: Request, res: Response, next: NextFunction) {
    try {
        const { pollId } = req.params;
        const { answers, anonToken } = req.body;
        
        let respondentId: string | null = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
                respondentId = decoded.sub;
            } catch (e) {
                // Ignore invalid token, default to anonymous
            }
        }

        const response = await responsesService.submitResponse(pollId, respondentId, anonToken, answers);
        return ApiResponse.created(res, "Response submitted successfully", response);
    } catch (error) {
        next(error);
    }
}
