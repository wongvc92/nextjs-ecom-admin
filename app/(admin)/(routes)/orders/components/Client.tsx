"use client";

import { useSearchParams } from "next/navigation";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import NameFilter from "./name-filter";
import StatusFilter from "./status-filter";
import Link from "next/link";

export const OrderClient = () => {
  const searchParams = useSearchParams();

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        <DatePickerWithRange title="Created" />
        <StatusFilter />
        <NameFilter />
        {(searchParams.get("productName") ||
          searchParams.getAll("status").length > 0 ||
          searchParams.get("dateFrom") ||
          searchParams.get("dateTo")) && (
          <Link href="orders?page=1&perPage=5 " className="text-xs underline text-muted-foreground">
            Clear filters
          </Link>
        )}
      </div>
    </>
  );
};
