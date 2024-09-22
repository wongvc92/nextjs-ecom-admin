import { boolean, timestamp, pgTable, text, primaryKey, integer, pgEnum, uuid } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";
import type { AdapterAccountType } from "next-auth/adapters";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("userRole", ["USER", "ADMIN"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  password: text("password"),
  role: userRoleEnum("userRole").default("USER"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationToken", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  token: text("token").notNull().unique(),
  email: text("email").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const passwordResetTokens = pgTable("passwordResetToken", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const twoFactorTokens = pgTable("twoFactorToken", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const twoFactorConfirmations = pgTable("twoFactorConfirmation", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }),
});

export const twoFactorConfirmationRelations = relations(twoFactorConfirmations, ({ one }) => ({
  user: one(users, {
    fields: [twoFactorConfirmations.userId],
    references: [users.id],
  }),
}));

export type Account = typeof accounts.$inferSelect;

export type TwoFactorConfirmation = typeof twoFactorConfirmations.$inferSelect;

export type TwoFactorToken = typeof twoFactorTokens.$inferSelect;

export type VerificationToken = typeof verificationTokens.$inferSelect;

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

export type User = typeof users.$inferSelect;
