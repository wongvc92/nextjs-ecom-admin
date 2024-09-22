import { SignInButton } from "@/components/auth/sign-in-button";
import React from "react";
import { SignInForm } from "../components/sign-in-form";

const SignInPage = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-10">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
