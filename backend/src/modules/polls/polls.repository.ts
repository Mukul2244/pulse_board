import { eq, or, sql } from "drizzle-orm";
import { db } from "@/common/db";
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
    return db.select().from(pollsTable).where(eq(pollsTable.creatorId, creatorId));
}

export async function getPollById(id: string) {
    const [poll] = await db.select().from(pollsTable).where(eq(pollsTable.id, id));
    return poll;
}

export async function getPollByIdOrLink(idOrLink: string) {
    // Determine if it's a UUID or Link
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrLink);
    
    let condition = eq(pollsTable.uniqueLink, idOrLink);
    if (isUuid) {
        condition = or(eq(pollsTable.id, idOrLink), eq(pollsTable.uniqueLink, idOrLink)) as any;
    }

    const [poll] = await db.select().from(pollsTable).where(condition);
    if (!poll) return null;

    // Load questions and options
    const questions = await db.select().from(questionsTable).where(eq(questionsTable.pollId, poll.id)).orderBy(questionsTable.order);
    
    // Simplistic Eager Loading
    const detailedQuestions = await Promise.all(questions.map(async (q) => {
        const options = await db.select().from(optionsTable).where(eq(optionsTable.questionId, q.id)).orderBy(optionsTable.order);
        return { ...q, options };
    }));

    return { ...poll, questions: detailedQuestions };
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
