"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const ClearFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <>
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
    </>
  );
};

export default ClearFilters;
