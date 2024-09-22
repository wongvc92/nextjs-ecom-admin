"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircleIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Data {
  name: string;
  url: string;
}
interface TableFilterDropdownProps {
  data: Data[];
  title: string;
  paramsName: string;
}
const TableFilterDropdown = ({ data, title, paramsName }: TableFilterDropdownProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const handleSetUrl = (ischecked: boolean, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (ischecked) {
      params.append(paramsName, value);
    } else {
      params.delete(paramsName); // remove all previous values
    }

    router.push(`${pathName}?${params.toString()}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="flex items-center justify-center gap-2 border-dashed rounded-full text-xs text-muted-foreground"
          size="sm"
        >
          <PlusCircleIcon />
          {title} {searchParams.getAll(paramsName).join(", ")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {data.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.name}
            className="capitalize "
            checked={searchParams.getAll(paramsName).includes(item.url)}
            defaultValue={searchParams.getAll(paramsName)}
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

export default TableFilterDropdown;
