import { and, between, count, eq, ilike } from "drizzle-orm";
import { db } from "../..";
import { PendingNewUser, pendingNewUsers as pendingNewUsersTable } from "../../schema/users";
import { queryPendingNewUserSchema, TQueryPendingNewUserSchema } from "@/lib/validation/pendingNewUserValidation";

export const getpendingNewUserStatsCount = async (): Promise<{ allPendingUsersCount: number }> => {
  try {
    const [allPendingUsers] = await db.select({ count: count() }).from(pendingNewUsersTable);

    return {
      allPendingUsersCount: allPendingUsers.count,
    };
  } catch (error) {
    console.error("Error fetching pending users stats:", error);
    throw new Error("Failed fetch pending users stats");
  }
};

export const getQueryPendingNewUsers = async (
  searchParams: TQueryPendingNewUserSchema
): Promise<{ pendingNewUsersData: PendingNewUser[]; count: number }> => {
  const parsedResult = queryPendingNewUserSchema.safeParse(searchParams);
  if (!parsedResult.success) {
    throw new Error("Invalid search parameters");
  }

  const { email, id, dateFrom, dateTo, page, perPage } = parsedResult.data;

  const whereCondition = [];

  if (email) {
    whereCondition.push(ilike(pendingNewUsersTable.email, `%${email}%`));
  }

  if (dateFrom && dateTo) {
    whereCondition.push(between(pendingNewUsersTable.createdAt, new Date(dateFrom), new Date(dateTo)));
  }

  const users = await db
    .select()
    .from(pendingNewUsersTable)
    .where(whereCondition.length > 0 ? and(...whereCondition) : undefined)
    .offset((parseInt(page) - 1) * parseInt(perPage))
    .limit(parseInt(page) - 1);

  const [userCount] = await db
    .select({ count: count() })
    .from(pendingNewUsersTable)
    .where(whereCondition.length > 0 ? and(...whereCondition) : undefined);

  return { pendingNewUsersData: users || [], count: userCount.count || 0 };
};

export const getPendingNewUserByEmail = async (email: string): Promise<PendingNewUser> => {
  const [newUser] = await db.select().from(pendingNewUsersTable).where(eq(pendingNewUsersTable.email, email));
  return newUser;
};
