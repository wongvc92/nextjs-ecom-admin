import type { NextAuthConfig } from "next-auth";

import { apiAuthRoutesPrefix, DEFAULT_REDIRECT_LOGIN, publicApiRoutes, publicRoutes } from "./routes";
import { getUserById } from "./lib/db/queries/admin/users";
import { getAccoutByUserId } from "./lib/db/queries/admin/auth";
import { UserRoleEnum } from "./@types/next-auth";

export const authConfig = {
  pages: {
    error: "/auth/sign-in",
    signIn: "/auth/sign-in",
    signOut: "/auth",
  },

  callbacks: {
    session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRoleEnum;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.isBlocked = token.isBlocked as boolean;
      }

      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user.role === "ADMIN";
      const isBlocked = auth?.user.isBlocked;
      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthRoutesPrefix);
      const isPublicApiRoute = nextUrl.pathname.startsWith(publicApiRoutes);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAuthRoute = nextUrl.pathname.startsWith("/");

      if (isLoggedIn && ["/auth/sign-in", "/auth/sign-up"].includes(nextUrl.pathname)) {
        return Response.redirect(new URL(DEFAULT_REDIRECT_LOGIN, nextUrl));
      }

      if (isApiAuthRoute || isPublicRoute || isPublicApiRoute) {
        return true; // Allow access to API auth routes and public routes
      }

      if (!isAdmin && nextUrl.pathname.startsWith("/users")) {
        return false;
      }

      if (isAuthRoute && isLoggedIn) {
        if (isBlocked) {
          return Response.redirect(new URL("/access-blocked", nextUrl));
        }
        return true; // Allow access to authenticated routes if logged in
      }

      if (isAuthRoute && !isLoggedIn) {
        let callbackurl = nextUrl.search;
        if (nextUrl.search) {
          callbackurl += nextUrl.search;
        }
        const encodedCallbackUrl = encodeURIComponent(callbackurl);
        return Response.redirect(new URL(`/auth/sign-in?callbackurl=${encodedCallbackUrl}`, nextUrl)); // Redirect to sign-in if not logged in
      }

      return true; // Allow access to any other routes (fallback)
    },
  },
  providers: [],
} satisfies NextAuthConfig;
