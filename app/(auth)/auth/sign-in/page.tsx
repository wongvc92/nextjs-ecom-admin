import React from "react";
import { SignInForm } from "../components/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Manage your authentication",
};

const SignInPage = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-10">
      <SignInForm />
    </div>
  );
};

export default SignInPage;
