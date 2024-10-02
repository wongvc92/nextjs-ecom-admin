"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const ClearFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <div>
      {(searchParams.get("email") || searchParams.get("dateFrom") || searchParams.get("dateTo")) && (
        <Button
          type="button"
          variant="link"
          onClick={() => {
            router.push("/users/pending-users?page=1&perPage=5", { scroll: false });
          }}
          className="text-xs underline text-muted-foreground"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default ClearFilters;
