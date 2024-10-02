import { eq } from "drizzle-orm";
import { db } from "../db";
import { pendingNewUsers } from "../db/schema/users";

export const addPendingUserDB = async (email: string) => {
  return await db.insert(pendingNewUsers).values({ email });
};

export const deletePendingUserDB = async (email: string) => {
  return await db.delete(pendingNewUsers).where(eq(pendingNewUsers.email, email));
};
