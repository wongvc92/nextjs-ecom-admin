"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, PlusCircleIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const isArchived = [
  { name: "yes", url: "TRUE" },
  { name: "no", url: "FALSE" },
];

const IsArchivedFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [toggleOpen, setToggleOpen] = useState(false);
  const handleSetUrl = (ischecked: boolean, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (ischecked) {
      params.append("isArchived", value);
    } else {
      params.delete("isArchived", value);
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
          Archived <span className="text-muted-foreground text-[10px] text-sky-300 font-bold">{searchParams.getAll("isArchived").join(", ")}</span>
          <ChevronDown className={toggleOpen ? "rotate-180 transition duration-300" : "transition duration-300"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isArchived.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.name}
            className="capitalize text-muted-foreground text-xs"
            checked={searchParams.getAll("isArchived").includes(item.url)}
            defaultChecked={searchParams.getAll("isArchived").includes(item.url)}
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

export default IsArchivedFilter;
