import { SignInButton } from "@/components/auth/sign-in-button";
import React from "react";

import SignUpForm from "../components/sign-up-form";

const SignUpPage = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-10">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
