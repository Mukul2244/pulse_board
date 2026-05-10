import { eq } from "drizzle-orm";

import { db } from "@/common/db";
import { usersTable } from "@/common/db/schema";

export async function findUserByEmail(
    email: string
) {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

    return user;
}

export async function createUser(data: any) {
    const [user] = await db
        .insert(usersTable)
        .values(data)
        .returning();

    return user;
}