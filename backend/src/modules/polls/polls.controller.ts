import { Request, Response, NextFunction } from "express";
import ApiResponse from "@/common/utils/api-response";
import { CreatePollDto } from "./polls.dto";
import * as pollsService from "./polls.service";

export async function createPoll(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.sub;
        const poll = await pollsService.createPoll(userId, req.body);

        return ApiResponse.created(res, "Poll created successfully", poll);
    } catch (error) {
        next(error);
    }
}

export async function getMyPolls(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).user.sub;
        const polls = await pollsService.getPollsByCreatorId(userId);
        const shaped = polls.map(({ questionsCount, responsesCount, ...poll }) => ({
            ...poll,
            _count: {
                questions: questionsCount ?? 0,
                responses: responsesCount ?? 0,
            },
        }));
        return ApiResponse.ok(res, "Polls retrieved successfully", shaped);
    } catch (error) {
        next(error);
    }
}

export async function getPollById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const poll = await pollsService.getPollByIdOrLink(id as string);
        if (!poll) return res.status(404).json({ message: "Poll not found" });

        return ApiResponse.ok(res, "Poll retrieved successfully", poll);
    } catch (error) {
        next(error);
    }
}

export async function publishPoll(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = (req as any).user.sub;

        await pollsService.publishPoll(userId, id as string);
        return ApiResponse.ok(res, "Poll published successfully", { id });
    } catch (error) {
        next(error);
    }
}

export async function getPollAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;;
        const userId = (req as any).user.sub;

        const analytics = await pollsService.getPollAnalytics(userId, id as string);
        return ApiResponse.ok(res, "Poll analytics retrieved", analytics);
    } catch (error) {
        next(error);
    }
}
