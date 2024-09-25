import React, { Suspense } from "react";
import CreateForm from "./components/create-form";
import { getDistinctCategories } from "@/lib/db/queries/admin/categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View order",
  description: "Manage orders for your store",
};

const ProductPage = async () => {
  const distinctCategories = await getDistinctCategories();
  return (
    <section className="w-full md:container">
      <Suspense>
        <CreateForm distinctCategories={distinctCategories} />
      </Suspense>
    </section>
  );
};

export default ProductPage;
