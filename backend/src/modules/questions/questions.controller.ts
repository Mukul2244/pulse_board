import { Request, Response, NextFunction } from "express";
import ApiResponse from "@/common/utils/api-response";
import * as questionsService from "./questions.service";

export async function addQuestionToPoll(req: Request, res: Response, next: NextFunction) {
    try {
        const { pollId } = req.params;
        const userId = (req as any).user.sub;
        
        const question = await questionsService.addQuestionToPoll(userId, pollId as string, req.body);
        return ApiResponse.created(res, "Question added", question);
    } catch (error) {
        next(error);
    }
}


export async function deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        // Here we'd ideally read pollId from req.query or lookup the question first
        // Assuming we're passing it by checking the service logic that looks it up
        const { questionId } = req.params;
        const { pollId } = req.body; // or query
        const userId = (req as any).user.sub;
        
        await questionsService.deleteQuestion(userId, pollId, questionId as string);
        return ApiResponse.ok(res, "Question deleted", { id: questionId });
    } catch (error) {
        next(error);
    }
}
