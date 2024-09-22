import NextAuth, { DefaultSession } from "next-auth";

export type UserRoleEnum = "USER" | "ADMIN";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: UserRoleEnum;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
