import React, { Suspense } from "react";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import ProductTable from "./components/product-table";
import { ProductFilters } from "./components/product-filters";
import TableSkeleton from "@/components/table-skeleton";
import { Heading } from "@/components/ui/heading";
import ProductStats from "./components/product-stats";
import StatsLoading from "@/components/loading/stats-loading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin/Products",
  description: "Manage your products",
};

const ProductsPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Products" description="Manage orders for your store" />

        <Link href="/products/add-new">
          <Button type="button" className="flex items-center">
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Add new</span>
          </Button>
        </Link>
      </div>
      <Separator className="my-4" />
      <Suspense fallback={<StatsLoading />}>
        <ProductStats />
      </Suspense>
      <Suspense fallback={"loading..."}>
        <ProductFilters />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <ProductTable searchParams={searchParams} />
      </Suspense>
    </section>
  );
};

export default ProductsPage;
