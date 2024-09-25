import React from "react";
import CreateForm from "./create-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Banner",
  description: "Manage your Banners",
};

const AddNewPage = () => {
  return (
    <section className="w-full md:container">
      <CreateForm />
    </section>
  );
};

export default AddNewPage;
