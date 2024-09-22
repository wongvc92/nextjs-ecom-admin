"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginButton = () => {
  return (
    <div>
      <Button variant="secondary">
        <Link href="/sign-in">Login</Link>
      </Button>
    </div>
  );
};
export default LoginButton;
