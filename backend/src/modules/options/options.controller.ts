import { Request, Response, NextFunction } from "express";
import ApiResponse from "@/common/utils/api-response";
import * as optionsService from "./options.service";

export async function addOptionToQuestion(req: Request, res: Response, next: NextFunction) {
    try {
        const { questionId } = req.params;
        const userId = (req as any).user.sub;

        const option = await optionsService.addOptionToQuestion(userId, questionId as string, req.body);
        return ApiResponse.created(res, "Option added", option);
    } catch (error) {
        next(error);
    }
}

export async function deleteOption(req: Request, res: Response, next: NextFunction) {
    try {
        const { questionId, optionId } = req.params;
        const userId = (req as any).user.sub;

        await optionsService.deleteOption(userId, questionId || req.body.questionId, optionId as string);
        return ApiResponse.ok(res, "Option deleted", { id: optionId });
    } catch (error) {
        next(error);
    }
}
