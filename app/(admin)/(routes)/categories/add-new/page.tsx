import { Metadata } from "next";
import CreateForm from "./create-form";

export const metadata: Metadata = {
  title: "Add Category",
  description: "Manage your categories",
};

const CreateCategoryPage = () => {
  return (
    <section className="w-full md:container">
      <CreateForm />
    </section>
  );
};

export default CreateCategoryPage;
