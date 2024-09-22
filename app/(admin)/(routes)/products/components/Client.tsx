"use client";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { columns } from "./Columns";
import { DataTable } from "@/components/ui/data-table";
import { Product } from "@/lib/db/schema/products";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import IsArchivedFilter from "./isArchived-filter";
import IsFeaturedFilter from "./isFeatured-filter";
import NameFilter from "./name-filter";
import CategoryFilter from "./category-filter";
import { Category } from "@/lib/db/schema/categories";
import ProductStats from "./product-stats";

interface ProductClientProps {
  data: Product[];
  totalPage: number;
  distinctCategories: Category[];
  archivedProductCount: number;
  featuredProductCount: number;
  allProductCount: number;
  outOfStockCount: number;
}

export const ProductClient: React.FC<ProductClientProps> = ({
  data,
  totalPage,
  distinctCategories,
  archivedProductCount,
  featuredProductCount,
  allProductCount,
  outOfStockCount,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!data) {
    return null;
  }
  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center  bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Products" description="Manage Products for your store" />
        <Button onClick={() => router.push("/products/add-new")} type="button">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Add new</span>
        </Button>
      </div>

      <ProductStats
        archivedProductCount={archivedProductCount}
        featuredProductCount={featuredProductCount}
        allProductCount={allProductCount}
        outOfStockCount={outOfStockCount}
      />

      <div className="flex flex-wrap gap-2 items-center">
        <DatePickerWithRange title="Created" className="" />
        {/* <TableFilterDropdown data={isFeatured} paramsName="isFeatured" title="Featured" />
        <TableFilterDropdown data={isArchived} paramsName="isArchived" title="Archived" /> */}
        <NameFilter />
        <IsArchivedFilter />

        <IsFeaturedFilter />
        <CategoryFilter distinctCategories={distinctCategories} />
        {(searchParams.get("name") ||
          searchParams.getAll("isArchived").length > 0 ||
          searchParams.getAll("isFeatured").length > 0 ||
          searchParams.getAll("category").length > 0 ||
          searchParams.get("dateFrom") ||
          searchParams.get("dateTo") ||
          searchParams.get("isOutOfStock")) && (
          <Button
            type="button"
            variant="link"
            onClick={() => {
              router.push("/products?page=1&perPage=5", { scroll: false });
            }}
            className="text-xs underline text-muted-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={data} totalPage={totalPage} />
    </section>
  );
};
