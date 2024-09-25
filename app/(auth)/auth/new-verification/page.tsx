import React from "react";
import NewVerificationForm from "../components/new-verification-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New verification",
  description: "Manage your authentication",
};

const NewVerificationPage = () => {
  return (
    <div className="min-h-screen max-w-md mx-auto px-4 py-10">
      <NewVerificationForm />
    </div>
  );
};

export default NewVerificationPage;
