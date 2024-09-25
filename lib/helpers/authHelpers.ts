import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const ensureAuthenticated = async () => {
  const session = await auth();
  if (!session?.user.id) {
    redirect("/auth/sign-in");
  }
  return session;
};
