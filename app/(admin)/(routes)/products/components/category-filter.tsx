"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusCircleIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/db/schema/categories";

const CategoryFilter = ({ distinctCategories }: { distinctCategories: Category[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [toggleOpen, setToggleOpen] = useState(false);
  const handleSetUrl = (ischecked: boolean, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (ischecked) {
      params.append("category", value);
    } else {
      params.delete("category", value);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <DropdownMenu open={toggleOpen} onOpenChange={() => setToggleOpen(!toggleOpen)}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className="flex items-center justify-center gap-1 border-dashed rounded-full text-muted-foreground text-xs"
          size="sm"
        >
          Category <span className="text-muted-foreground text-[10px] text-sky-300 font-bold">{searchParams.getAll("category").join(", ")}</span>
          <ChevronDown className={toggleOpen ? "rotate-180 transition duration-300" : "transition duration-300"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {distinctCategories.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.name}
            className="capitalize text-muted-foreground text-xs"
            checked={searchParams.getAll("category").includes(item.name)}
            defaultChecked={searchParams.getAll("category").includes(item.name)}
            onCheckedChange={(ischecked) => {
              handleSetUrl(ischecked, item.name);
            }}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryFilter;
