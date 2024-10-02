import { Metadata } from "next";
import CreateForm from "./create-form";

export const metadata: Metadata = {
  title: "Add User",
  description: "Manage your users",
};

const CreateUserPage = () => {
  return (
    <section className="w-full md:container">
      <CreateForm />
    </section>
  );
};

export default CreateUserPage;
