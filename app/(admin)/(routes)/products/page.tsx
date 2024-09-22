import React, { Suspense } from "react";
import { ProductClient } from "./components/Client";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { getProducts, getProductStatsCount } from "@/lib/db/queries/admin/products";
import { getDistinctCategories } from "@/lib/db/queries/admin/categories";

export const metadata: Metadata = {
  title: "Admin/Products",
  description: "Manage your products",
};

const getCachedDistinctCategories = unstable_cache(async () => getDistinctCategories(), ["categories"], { tags: ["categories"] });

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: {
    name: string;
    perPage: string;
    page: string;
    dateFrom: string;
    dateTo: string;
    isArchived: string | string[];
    isFeatured: string | string[];
    category: string | string[];
    isOutOfStock: string;
  };
}) => {
  const name = searchParams.name || "";
  const perPage = searchParams.perPage || "10";
  const page = searchParams.page || "1";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";
  const isArchived = searchParams.isArchived || "";
  const isFeatured = searchParams.isFeatured || "";
  const category = searchParams.category || "";
  const isOutOfStock = searchParams.isOutOfStock || "";

  const { filteredCount, products } = await getProducts(name, perPage, page, dateFrom, dateTo, isArchived, isFeatured, category, isOutOfStock);
  const distinctCategories = await getCachedDistinctCategories();
  const { archivedProductCount, featuredProductCount, allProductCount, outOfStockCount } = await getProductStatsCount();

  return (
    <Suspense>
      <ProductClient
        data={products}
        totalPage={filteredCount / parseInt(perPage)}
        distinctCategories={distinctCategories}
        archivedProductCount={archivedProductCount}
        featuredProductCount={featuredProductCount}
        allProductCount={allProductCount}
        outOfStockCount={outOfStockCount}
      />
    </Suspense>
  );
};

export default ProductsPage;
