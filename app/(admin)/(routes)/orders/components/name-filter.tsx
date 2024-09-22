"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const NameFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [toggleOpen, setToggleOpen] = useState(false);
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("productName", value);
    } else {
      params.delete("productName");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 1000);

  return (
    <Popover open={toggleOpen} onOpenChange={() => setToggleOpen(!toggleOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="flex items-center justify-center gap-1 border-dashed rounded-full text-muted-foreground text-xs"
        >
          Name <span className="text-muted-foreground text-[10px] text-sky-300 font-bold">{searchParams.getAll("productName")}</span>
          <ChevronDown className={toggleOpen ? "rotate-180 transition duration-300" : "transition duration-300"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="productName">Name</Label>
              <Input
                id="productName"
                defaultValue={searchParams.get("productName")?.toString()}
                className="col-span-2 h-8"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NameFilter;
