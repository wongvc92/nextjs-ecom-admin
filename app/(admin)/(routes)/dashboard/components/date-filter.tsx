"use client";

import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { subDays, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface DateFilterProps {
  dateFromParams: string;
  dateToParams: string;
}

const DateFilter: React.FC<DateFilterProps> = ({ dateFromParams, dateToParams }) => {
  const dateRange = [
    { name: "last 7 days", dateFromParams: subDays(new Date(), 7), dateToParams: new Date() },
    { name: "last 30 days", dateFromParams: subDays(new Date(), 30), dateToParams: new Date() },
    { name: "last 3 months", dateFromParams: subMonths(new Date(), 3), dateToParams: new Date() },
    { name: "last 6 months", dateFromParams: subMonths(new Date(), 6), dateToParams: new Date() },
    { name: "last 12 months", dateFromParams: subMonths(new Date(), 12), dateToParams: new Date() },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSetUrl = (ischecked: boolean, dateFrom: Date, dateTo: Date) => {
    const params = new URLSearchParams(searchParams);
    if (ischecked) {
      params.set(dateFromParams, dateFrom.toISOString());
      params.set(dateToParams, dateTo.toISOString());
    } else {
      params.delete(dateFromParams);
      params.delete(dateToParams);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} type="button" className="flex items-center justify-center gap-2 text-muted-foreground text-xs" size="sm">
          <CalendarIcon /> Date
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dateRange.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.name}
            className="capitalize text-muted-foreground text-xs"
            checked={
              searchParams.get(dateFromParams) === item.dateFromParams.toISOString() &&
              searchParams.get(dateToParams) === item.dateToParams.toISOString()
            }
            defaultChecked={
              searchParams.get(dateFromParams) === item.dateFromParams.toISOString() &&
              searchParams.get(dateToParams) === item.dateToParams.toISOString()
            }
            onCheckedChange={(ischecked) => {
              handleSetUrl(ischecked, item.dateFromParams, item.dateToParams);
            }}
          >
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}

        <DatePickerWithRange title="Custom" className="w-full" dateFromParams={dateFromParams} dateToParams={dateToParams} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateFilter;
