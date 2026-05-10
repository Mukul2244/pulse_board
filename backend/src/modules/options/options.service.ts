import * as optionsRepository from "./options.repository";
import ApiError from "@/common/utils/api-error";
import { db } from "@/common/db";
import { questionsTable, pollsTable } from "@/common/db/schema";
import { eq } from "drizzle-orm";

export async function addOptionToQuestion(userId: string, questionId: string, data: any) {
    const [question] = await db.select().from(questionsTable).where(eq(questionsTable.id, questionId));
    if (!question) throw ApiError.notFound("Question not found");

    const [poll] = await db.select().from(pollsTable).where(eq(pollsTable.id, question.pollId));
    if (!poll || poll.creatorId !== userId) throw ApiError.forbidden("Not authorized");

    return optionsRepository.addOption({
        ...data,
        questionId
    });
}

export async function deleteOption(userId: string, questionId: string, optionId: string) {
    const [question] = await db.select().from(questionsTable).where(eq(questionsTable.id, questionId));
    if (!question) throw ApiError.notFound("Question not found");

    const [poll] = await db.select().from(pollsTable).where(eq(pollsTable.id, question.pollId));
    if (!poll || poll.creatorId !== userId) throw ApiError.forbidden("Not authorized");

    return optionsRepository.deleteOption(optionId);
}
