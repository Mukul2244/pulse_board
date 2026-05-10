import * as questionsRepository from "./questions.repository";
import ApiError from "@/common/utils/api-error";
import { getPollById } from "../polls/polls.repository";

export async function addQuestionToPoll(userId: string, pollId: string, data: any) {
    const poll = await getPollById(pollId);
    if (!poll) throw ApiError.notFound("Poll not found");
    if (poll.creatorId !== userId) throw ApiError.forbidden("Not authorized");

    return questionsRepository.addQuestion({
        ...data,
        pollId
    });
}

export async function deleteQuestion(userId: string, pollId: string, questionId: string) {
    const poll = await getPollById(pollId);
    if (!poll) throw ApiError.notFound("Poll not found");
    if (poll.creatorId !== userId) throw ApiError.forbidden("Not authorized");

    return questionsRepository.deleteQuestion(questionId);
}
