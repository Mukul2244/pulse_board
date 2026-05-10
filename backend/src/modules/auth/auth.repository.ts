import { eq } from "drizzle-orm";

import { db } from "@/common/db";
import { usersTable } from "@/common/db/schema";

export async function findUserByEmail(
    email: string
) {
    return db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
    });
}

export async function createUser(data: any) {
    const [user] = await db
        .insert(usersTable)
        .values(data)
        .returning();

    return user;
}