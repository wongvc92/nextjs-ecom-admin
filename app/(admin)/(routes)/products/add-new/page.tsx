import React, { Suspense } from "react";
import CreateForm from "./components/create-form";
import { unstable_cache } from "next/cache";
import { getDistinctCategories } from "@/lib/db/queries/admin/categories";

const getCachedDistinctCategories = unstable_cache(async () => getDistinctCategories(), ["categories"], { tags: ["categories"] });
const ProductPage = async () => {
  const distinctCategories = await getCachedDistinctCategories();
  return (
    <section className="w-full md:container">
      <Suspense>
        <CreateForm distinctCategories={distinctCategories} />
      </Suspense>
    </section>
  );
};

export default ProductPage;
