import React from "react";
import NewPasswordForm from "../components/new-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New password",
  description: "Manage your authentication",
};

const NewPasswordPage = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-10">
      <NewPasswordForm />
    </div>
  );
};

export default NewPasswordPage;
