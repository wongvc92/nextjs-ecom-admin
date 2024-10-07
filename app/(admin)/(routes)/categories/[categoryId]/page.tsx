import EditForm from "./components/edit-form";
import { cache, Suspense } from "react";
import { getCategoryById } from "@/lib/db/queries/admin/categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Category",
  description: "Manage your categories",
};

const getCachedCategoryById = cache(async (categoryId: string) => {
  return await getCategoryById(categoryId);
});
const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const result = await getCachedCategoryById(params.categoryId);

  return (
    <section className="w-full md:container">
      <EditForm initialData={result} />
    </section>
  );
};

export default CategoryPage;
