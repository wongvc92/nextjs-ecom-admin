import type { NextAuthConfig } from "next-auth";

import { apiAuthRoutesPrefix, authRoutes, DEFAULT_REDIRECT_LOGIN, publicRoutes } from "./routes";

export const authConfig = {
  pages: {
    error: "/auth/sign-in",
    signIn: "/auth/sign-in",
    signOut: "/auth",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthRoutesPrefix);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);

      if (isLoggedIn && ["/auth/sign-in", "/auth/sign-up"].includes(nextUrl.pathname)) {
        return Response.redirect(new URL(DEFAULT_REDIRECT_LOGIN, nextUrl)); // Redirect logged-in users to a default page
      }

      if (isApiAuthRoute || isPublicRoute) {
        return true; // Allow access to API auth routes and public routes
      }

      if (isAuthRoute && isLoggedIn) {
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
