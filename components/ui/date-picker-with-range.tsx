"use client";

import * as React from "react";
import { addDays, format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function DatePickerWithRange({ className, title }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined, // Two weeks ago
    to: undefined, // Today
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const updateSearchParams = (selectedDate: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDate?.from) {
      params.set("dateFrom", selectedDate.from.toISOString());
    } else {
      params.delete("dateFrom");
    }

    if (selectedDate?.to) {
      params.set("dateTo", selectedDate.to.toISOString());
    } else {
      params.delete("dateTo");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    updateSearchParams(selectedDate);
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal rounded-full border border-dashed text-xs text-muted-foreground",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yy")} - {format(date.to, "dd/MM/yy")}
                </>
              ) : (
                format(date.from, "dd/MM/yy")
              )
            ) : (
              <span>{title}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="text-xs text-muted-foreground"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
