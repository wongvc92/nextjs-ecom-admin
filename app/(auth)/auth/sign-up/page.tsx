import React from "react";
import SignUpForm from "../components/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Manage your authentication",
};

const SignUpPage = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-10">
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
