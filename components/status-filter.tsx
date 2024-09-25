"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LoaderCircleIcon } from "lucide-react";

const status = [
  { name: "cancelled", url: "cancelled" },
  { name: "pending", url: "pending" },
  { name: "toShip", url: "toShip" },
  { name: "shipped", url: "shipped" },
  { name: "completed", url: "completed" },
];

const StatusFilter = ({ paramsKey }: { paramsKey: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSetUrl = (ischecked: boolean, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (ischecked) {
      params.set(paramsKey, value);
    } else {
      params.delete(paramsKey);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="flex items-center justify-center gap-2 text-muted-foreground text-xs" size="sm">
          <LoaderCircleIcon />
          Status <span className="text-muted-foreground text-[10px] text-sky-300 font-bold">{searchParams.get(paramsKey)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.name}
            className="capitalize text-muted-foreground text-xs"
            checked={searchParams.get(paramsKey) === item.url}
            defaultChecked={searchParams.get(paramsKey) === item.url}
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

export default StatusFilter;
