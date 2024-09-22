"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./Columns";
import { Heading } from "@/components/ui/heading";
import { Category } from "@/lib/db/schema/categories";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import Link from "next/link";
import NameFilter from "./name-filter";

interface CategoryClientProps {
  data?: Category[];
  totalPage: number;
}

//data props passed from parent component which is retrieved from database as array
export const CategoryClient: React.FC<CategoryClientProps> = ({ data, totalPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  if (!data) {
    return null;
  }

  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title={`Categories (${data.length})`} description="Manage categories for your store" />

        <Button onClick={() => router.push(`categories/add-new`)} type="button">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Add new</span>
        </Button>
      </div>
      <Separator />
      <div className="flex flex-wrap gap-2 items-center">
        <DatePickerWithRange title="Created" />
        <NameFilter />
        {(searchParams.get("name") || searchParams.get("dateFrom") || searchParams.get("dateTo")) && (
          <Link href={`${pathName}`} className="text-xs underline text-muted-foreground">
            Clear filters
          </Link>
        )}
      </div>

      <DataTable columns={columns} data={data} totalPage={totalPage} />
    </section>
  );
};
