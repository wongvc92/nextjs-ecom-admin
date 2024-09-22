import React, { Suspense } from "react";
import { CategoryClient } from "./components/Client";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { getCategories } from "@/lib/db/queries/admin/categories";

export const metadata: Metadata = {
  title: "Admin/Categories",
  description: "Manage your categories",
};

const getCachedCategories = unstable_cache(
  async (name: string, perPage: string, page: string, dateFrom: string, dateTo: string) => getCategories(name, perPage, page, dateFrom, dateTo),
  ["categories"],
  { tags: ["categories"] }
);

const CategoriesPage = async ({
  searchParams,
}: {
  searchParams: { name: string; perPage: string; page: string; dateFrom: string; dateTo: string };
}) => {
  const name = searchParams.name || "";
  const perPage = searchParams.perPage || "5";
  const page = searchParams.page || "1";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";

  const { categoriesData, categoryCount } = await getCachedCategories(name, perPage, page, dateFrom, dateTo);

  return (
    <Suspense>
      <CategoryClient data={categoriesData} totalPage={categoryCount / parseInt(perPage)} />
    </Suspense>
  );
};

export default CategoriesPage;
