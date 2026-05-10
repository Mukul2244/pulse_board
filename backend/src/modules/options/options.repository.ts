import { eq } from "drizzle-orm";
import { db } from "@/common/db";
import { optionsTable } from "@/common/db/schema";

export async function addOption(data: any) {
    const [option] = await db.insert(optionsTable).values(data).returning();
    return option;
}

export async function deleteOption(id: string) {
    const [option] = await db.delete(optionsTable).where(eq(optionsTable.id, id)).returning();
    return option;
}
