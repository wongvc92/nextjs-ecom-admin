import EditForm from "./components/edit-form";
import { getCategoryById } from "@/lib/db/queries/admin/categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Category",
  description: "Manage your categories",
};

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const result = await getCategoryById(params.categoryId);

  return (
    <section className="w-full md:container">
      <EditForm initialData={result} />
    </section>
  );
};

export default CategoryPage;
