import { eq } from "drizzle-orm";
import { db } from "../db";
import { users as usersTable } from "../db/schema/users";

export const addBlocklistUserDB = async (email: string) => {
  return await db.update(usersTable).set({ isBlocked: true }).where(eq(usersTable.email, email));
};

export const undoBlocklistUserDB = async (email: string) => {
  return await db.update(usersTable).set({ isBlocked: false }).where(eq(usersTable.email, email));
};

export const makeAdminDB = async (email: string) => {
  return await db.update(usersTable).set({ role: "ADMIN" }).where(eq(usersTable.email, email));
};

export const makeUserDB = async (email: string) => {
  return await db.update(usersTable).set({ role: "USER" }).where(eq(usersTable.email, email));
};
