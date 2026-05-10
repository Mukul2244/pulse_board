import { eq } from "drizzle-orm";
import { db } from "@/common/db";
import { questionsTable } from "@/common/db/schema";

export async function addQuestion(data: any) {
    const [question] = await db.insert(questionsTable).values(data).returning();
    return question;
}

export async function deleteQuestion(id: string) {
    const [question] = await db.delete(questionsTable).where(eq(questionsTable.id, id)).returning();
    return question;
}
