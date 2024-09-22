"use client";

import { LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.push("/auth/sign-in")} className="flex items-center gap-2">
      <LogInIcon /> Sign in
    </button>
  );
}
