import React, { Suspense } from "react";
import { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import CategoryTable from "./components/category-table";
import CategoryFilters from "./components/category-filters";
import FiltersLoading from "@/components/loading/filters-loading";
import TableLoading from "@/components/loading/table-loading";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage your categories",
};
export const dynamic = "force-dynamic";
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

  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Categories" description="Manage categories for your store" />
        <Link href="/categories/add-new">
          <Button type="button" className="flex items-center">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Add new</span>
          </Button>
        </Link>
      </div>
      <Separator />
      <Suspense fallback={<FiltersLoading />}>
        <CategoryFilters />
      </Suspense>
      <Suspense fallback={<TableLoading />}>
        <CategoryTable perPage={perPage} name={name} page={page} dateFrom={dateFrom} dateTo={dateTo} />
      </Suspense>
    </section>
  );
};

export default CategoriesPage;
