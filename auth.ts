import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db";
import { AuthError } from "next-auth";
import { authConfig } from "./auth.config";
import { UserRoleEnum } from "./@types/next-auth";
import Google from "next-auth/providers/google";
import Credentials from "@auth/core/providers/credentials";
import bcrypt from "bcrypt";
import { twoFactorConfirmations, users } from "./lib/db/schema/users";
import { eq } from "drizzle-orm";
import { getAccoutByUserId, getTwoFactorConfirmationByUserId } from "./lib/db/queries/admin/auth";
import { signInSchema } from "./lib/validation/auth-validation";
import { getUserByEmail, getUserById } from "./lib/db/queries/admin/users";
import { deletePendingUserDB } from "./lib/services/pendingNewUserServices";
import { getPendingNewUserByEmail } from "./lib/db/queries/admin/pendingNewUsers";

export const { handlers, auth, signOut, signIn } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (parsedCredentials.success) {
          const user = await getUserByEmail(parsedCredentials.data.email);
          if (!user || !user.password) return null;
          const passwordMatched = await bcrypt.compare(parsedCredentials.data.password, user.password);
          if (passwordMatched) {
            return user;
          }
          return null;
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccoutByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isBlocked = existingUser.isBlocked;
      return token;
    },

    async session({ token, session, user }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRoleEnum;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
  },

  events: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return;
      }

      const existingUser = await getUserById(user.id as string);

      if (!existingUser?.emailVerified) {
        throw new AuthError("Email not verified");
      }

      const pendingNewUser = await getPendingNewUserByEmail(user.email as string);
      if (pendingNewUser) {
        await deletePendingUserDB(existingUser.email as string);
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation) {
          throw new AuthError("Someting went wrong");
        }
        await db.delete(twoFactorConfirmations).where(eq(twoFactorConfirmations.id, twoFactorConfirmation.id));
      }

      return;
    },

    async linkAccount({ user }) {
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
        })
        .where(eq(users.id, user.id as string));
    },
  },
});

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
  }
}
