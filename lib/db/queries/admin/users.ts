import { eq } from "drizzle-orm";
import { db } from "../..";
import { User, users } from "../../schema/users";

export const getUserFromDb = async (email: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return null;
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};

export const getUserById = async (id: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return null;
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};
