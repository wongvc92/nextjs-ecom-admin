import { and, between, count, eq, ilike } from "drizzle-orm";
import { db } from "../..";
import { User, users as usersTable, UserWithoutPassword, pendingNewUsers as pendingNewUsersTable } from "../../schema/users";
import { queryUserSchema, TQueryUser } from "@/lib/validation/userValidation";

export const getUserById = async (id: string): Promise<User | null> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) return null;
  return user;
};

export const getUserByName = async (name: string) => {
  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.name, name));
  return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) return null;
  return user;
};

export const getQueryUsers = async (searchParams: TQueryUser): Promise<{ usersData: UserWithoutPassword[]; count: number }> => {
  const parsedResult = queryUserSchema.safeParse(searchParams);
  if (!parsedResult.success) {
    throw new Error("Invalid search parameters");
  }

  const { email, id, isTwoFactorEnabled, name, role, perPage, page, dateFrom, dateTo, isBlocked } = parsedResult.data;

  const whereCondition = [];

  if (name) {
    whereCondition.push(ilike(usersTable.name, `%${name}%`));
  }

  if (role === "ADMIN") {
    whereCondition.push(eq(usersTable.role, "ADMIN"));
  } else if (role === "USER") {
    whereCondition.push(eq(usersTable.role, "USER"));
  }

  if (email) {
    whereCondition.push(ilike(usersTable.email, `%${email}%`));
  }

  if (id) {
    whereCondition.push(eq(usersTable.id, id));
  }

  if (isTwoFactorEnabled === "TRUE") {
    whereCondition.push(eq(usersTable.isTwoFactorEnabled, true));
  }

  if (isTwoFactorEnabled === "TRUE") {
    whereCondition.push(eq(usersTable.isTwoFactorEnabled, true));
  }

  if (isBlocked === "TRUE") {
    whereCondition.push(eq(usersTable.isBlocked, true));
  }

  if (dateFrom && dateTo) {
    whereCondition.push(between(usersTable.emailVerified, new Date(dateFrom), new Date(dateTo)));
  }

  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      role: usersTable.role,
      email: usersTable.email,
      emailVerified: usersTable.emailVerified,
      image: usersTable.image,
      isTwoFactorEnabled: usersTable.isTwoFactorEnabled,
      isBlocked: usersTable.isBlocked,
    })
    .from(usersTable)
    .where(whereCondition.length > 0 ? and(...whereCondition) : undefined)
    .offset((parseInt(page) - 1) * parseInt(perPage))
    .limit(parseInt(page) - 1);

  const [userCount] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(whereCondition.length > 0 ? and(...whereCondition) : undefined);

  return { usersData: users || [], count: userCount.count || 0 };
};

export const getUserStatsCount = async () => {
  try {
    const [allUsers] = await db.select({ count: count() }).from(usersTable);
    const [totalAdminRole] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "ADMIN"));
    const [totalUserRole] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.role, "USER"));
    const [blockedUsers] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.isBlocked, true));

    return {
      allUsersCount: allUsers.count,
      totalAdminRoleCount: totalAdminRole.count,
      totalUserRoleCount: totalUserRole.count,
      blockedUsersCount: blockedUsers.count,
    };
  } catch (error) {
    console.error("Error fetching users stats:", error);
    throw new Error("Failed fetch users stats");
  }
};
