"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { capitalizeFirstChar } from "@/lib/utils/formaters";
import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STATUS_FILTER_LIST = [
  {
    id: 1,
    name: "NO",
    searchParams: "FALSE",
  },
  {
    id: 2,
    name: "YES",
    searchParams: "TRUE",
  },
] as const;

const PublishedFilter = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();

  const handlestatusFilter = (searchParams: string) => {
    params.set("published", searchParams);

    push(`${pathname}/?${params.toString()}`);
  };

  return (
    <>
      {STATUS_FILTER_LIST && STATUS_FILTER_LIST.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm ">
            <span className="">Published</span>
            <span className="text-muted-foreground hidden md:block">
              {capitalizeFirstChar(searchParams.get("published") === "TRUE" ? "YES" : "NO")}
            </span>
            <ArrowUpDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {STATUS_FILTER_LIST.map((item) => (
              <DropdownMenuItem onClick={() => handlestatusFilter(item.searchParams)} key={item.id}>
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default PublishedFilter;
