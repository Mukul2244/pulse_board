import { eq, or, sql, desc, countDistinct, asc } from "drizzle-orm";
import { db } from "@/common/db/main";
import {
    pollsTable,
    questionsTable,
    optionsTable,
    responsesTable,
    answersTable
} from "@/common/db/schema";

export async function createPoll(data: any) {
    const [poll] = await db.insert(pollsTable).values(data).returning();
    return poll;
}

export async function getPollsByCreatorId(creatorId: string) {
    return db
        .select({
            id: pollsTable.id,
            creatorId: pollsTable.creatorId,
            uniqueLink: pollsTable.uniqueLink,
            title: pollsTable.title,
            description: pollsTable.description,
            isAnonymous: pollsTable.isAnonymous,
            isPublished: pollsTable.isPublished,
            expiresAt: pollsTable.expiresAt,
            createdAt: pollsTable.createdAt,
            updatedAt: pollsTable.updatedAt,

            questionsCount: countDistinct(questionsTable.id),
            responsesCount: countDistinct(responsesTable.id),
        })
        .from(pollsTable)
        .leftJoin(
            questionsTable,
            eq(questionsTable.pollId, pollsTable.id)
        )
        .leftJoin(
            responsesTable,
            eq(responsesTable.pollId, pollsTable.id)
        )
        .where(eq(pollsTable.creatorId, creatorId))
        .groupBy(
            pollsTable.id,
            pollsTable.creatorId,
            pollsTable.uniqueLink,
            pollsTable.title,
            pollsTable.description,
            pollsTable.isAnonymous,
            pollsTable.isPublished,
            pollsTable.expiresAt,
            pollsTable.createdAt,
            pollsTable.updatedAt,
        )
        .orderBy(desc(pollsTable.createdAt));
}
export async function getPollById(id: string) {
    const [poll] = await db.select().from(pollsTable).where(eq(pollsTable.id, id));
    return poll;
}

export async function getPollByIdOrLink(idOrLink: string) {
    const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            .test(idOrLink);

    return db.query.pollsTable.findFirst({
        where: isUuid
            ? or(
                eq(pollsTable.id, idOrLink),
                eq(pollsTable.uniqueLink, idOrLink),
            )
            : eq(pollsTable.uniqueLink, idOrLink),

        with: {
            questions: {
                orderBy: asc(questionsTable.order),
                with: {
                    options: {
                        orderBy: asc(optionsTable.order),  // ✅ all options in same query
                    },
                },
            },
        },
    });
}

export async function updatePoll(id: string, data: any) {
    const [poll] = await db.update(pollsTable).set(data).where(eq(pollsTable.id, id)).returning();
    return poll;
}

export async function getPollAnalytics(pollId: string) {
    // 1. Total responses count
    const [responseCountResult] = await db.select({ count: sql<number>`count(*)` })
        .from(responsesTable)
        .where(eq(responsesTable.pollId, pollId));

    const totalResponses = responseCountResult.count;

    // 2. Load questions
    const questions = await db.select().from(questionsTable).where(eq(questionsTable.pollId, pollId)).orderBy(questionsTable.order);

    // 3. For each question, load options and their selection count
    const analytics = await Promise.all(questions.map(async (q) => {
        const options = await db.select().from(optionsTable).where(eq(optionsTable.questionId, q.id)).orderBy(optionsTable.order);

        const optionAnalytics = await Promise.all(options.map(async (opt) => {
            const [answerCount] = await db.select({ count: sql<number>`count(*)` })
                .from(answersTable)
                .where(eq(answersTable.optionId, opt.id));

            return {
                id: opt.id,
                text: opt.text,
                count: Number(answerCount.count)
            }
        }));

        return {
            id: q.id,
            text: q.text,
            isMandatory: q.isMandatory,
            options: optionAnalytics
        };
    }));

    return {
        totalResponses: Number(totalResponses),
        questions: analytics
    };
}
