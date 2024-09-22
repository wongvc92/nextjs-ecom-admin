"use client";

import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

const SignOutButton = () => {
  return (
    <button onClick={() => signOut()} className="flex items-end gap-2">
      <LogOutIcon /> Sign out
    </button>
  );
};

export default SignOutButton;
