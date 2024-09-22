import EditForm from "./components/edit-form";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { getCategoryById } from "@/lib/db/queries/admin/categories";

const getCachedCategoryById = unstable_cache(async (id: string) => getCategoryById(id), ["categories"], { tags: ["categories"] });

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const result = await getCachedCategoryById(params.categoryId);

  return (
    <section className="w-full md:container">
      <Suspense>
        <EditForm initialData={result} />
      </Suspense>
    </section>
  );
};

export default CategoryPage;
