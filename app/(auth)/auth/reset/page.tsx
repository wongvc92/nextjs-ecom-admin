import React from "react";
import ResetForm from "../components/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Manage your authentication",
};

const ResetPage = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-10">
      <ResetForm />
    </div>
  );
};

export default ResetPage;
