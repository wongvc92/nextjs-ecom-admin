"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const isFeatured = [
  { name: "yes", url: "TRUE" },
  { name: "no", url: "FALSE" },
];

const IsFeaturedFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [toggleOpen, setToggleOpen] = useState(false);
  const handleSetUrl = (ischecked: boolean, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (ischecked) {
      params.append("isFeatured", value);
    } else {
      params.delete("isFeatured", value);
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
          Featured <span className="text-muted-foreground text-[10px] text-sky-300 font-bold">{searchParams.getAll("isFeatured").join(", ")}</span>
          <ChevronDown className={toggleOpen ? "rotate-180 transition duration-300" : "transition duration-300"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isFeatured.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.name}
            className="capitalize text-muted-foreground text-xs"
            checked={searchParams.getAll("isFeatured").includes(item.url)}
            defaultChecked={searchParams.getAll("isFeatured").includes(item.url)}
            onCheckedChange={(ischecked) => {
              handleSetUrl(ischecked, item.url);
            }}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IsFeaturedFilter;
