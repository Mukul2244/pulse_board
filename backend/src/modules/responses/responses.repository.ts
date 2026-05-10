import { db } from "@/common/db";
import { responsesTable, answersTable } from "@/common/db/schema";
import { nanoid } from "@/common/utils/nanoid";

export async function submitResponse(pollId: string, respondentId: string | null, anonToken: string | null, answers: Array<{ questionId: string, optionId: string }>) {
    return await db.transaction(async (tx) => {
        const _anonToken = respondentId ? null : (anonToken || nanoid(32));

        const [response] = await tx.insert(responsesTable).values({
            pollId,
            respondentId,
            anonToken: _anonToken
        }).returning();

        if (answers.length > 0) {
            const answerInserts = answers.map(a => ({
                responseId: response.id,
                questionId: a.questionId,
                optionId: a.optionId
            }));

            await tx.insert(answersTable).values(answerInserts);
        }

        return { ...response, anonToken: _anonToken };
    });
}
