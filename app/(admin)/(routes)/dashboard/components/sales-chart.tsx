"use client";

import { CalendarIcon, LoaderCircleIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import { Button } from "../../../../../components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, subDays, subMonths } from "date-fns";
import { ISalesReport } from "@/lib/db/queries/admin/orders";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../../../../../components/ui/calendar";

const chartConfig = {
  totalAmountSum: {
    label: "Total Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const dateRange = [
  { name: "last 7 days", salesDateFrom: subDays(new Date(), 7), salesDateTo: new Date() },
  { name: "last 30 days", salesDateFrom: subDays(new Date(), 30), salesDateTo: new Date() },
  { name: "last 3 months", salesDateFrom: subMonths(new Date(), 3), salesDateTo: new Date() },
  { name: "last 6 months", salesDateFrom: subMonths(new Date(), 6), salesDateTo: new Date() },
  { name: "last 12 months", salesDateFrom: subMonths(new Date(), 12), salesDateTo: new Date() },
];

export function SalesChart({ salesReport }: { salesReport: ISalesReport[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSetUrl = (ischecked: boolean, dateFrom: Date, dateTo: Date) => {
    const params = new URLSearchParams(searchParams);
    if (ischecked) {
      params.set("salesDateFrom", dateFrom.toISOString());
      params.set("salesDateTo", dateTo.toISOString());
    } else {
      params.delete("salesDateFrom");
      params.delete("salesDateTo");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Sales <span className="text-sky-500">{searchParams.get("salesStatus")} </span>per day
        </CardDescription>
      </CardHeader>
      <CardContent>
        {salesReport.length === 0 ? (
          <div className="flex justify-center items-center bg-muted w-full py-20 rounded-md text-muted-foreground">No results</div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={salesReport}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="totalAmountSum" fill="var(--color-totalAmountSum)" radius={8}>
                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          <span className="text-xs text-muted-foreground">
            {searchParams.get("salesDateFrom") &&
              searchParams.get("salesDateTo") &&
              `Showing orders from ${format(new Date(searchParams.get("salesDateFrom")!), "dd/MM/yy")} to ${format(
                new Date(searchParams.get("salesDateTo")!),
                "dd/MM/yy"
              )}`}
          </span>
        </div>
        <div className="flex flex-rowitems-center  ml-auto gap-2">
          <StatusFilter paramsKey="salesStatus" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="flex items-center justify-center gap-2 text-muted-foreground text-xs" size="sm">
                <CalendarIcon /> Date
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {dateRange.map((item) => (
                <DropdownMenuCheckboxItem
                  key={item.name}
                  className="capitalize text-muted-foreground text-xs"
                  checked={
                    searchParams.get("salesDateFrom") === item.salesDateFrom.toISOString() &&
                    searchParams.get("salesDateTo") === item.salesDateTo.toISOString()
                  }
                  defaultChecked={
                    searchParams.get("salesDateFrom") === item.salesDateFrom.toISOString() &&
                    searchParams.get("salesDateTo") === item.salesDateTo.toISOString()
                  }
                  onCheckedChange={(ischecked) => {
                    handleSetUrl(ischecked, item.salesDateFrom, item.salesDateTo);
                  }}
                >
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}

              <DatePickerWithRange title="Custom" className="w-full" />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}

const DatePickerWithRange = ({ className, title }: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined, // Two weeks ago
    to: undefined, // Today
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const updateSearchParams = (selectedDate: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDate?.from) {
      params.set("salesDateFrom", selectedDate.from.toISOString());
    } else {
      params.delete("salesDateFrom");
    }

    if (selectedDate?.to) {
      params.set("salesDateTo", selectedDate.to.toISOString());
    } else {
      params.delete("salesDateTo");
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
            className={cn("w-full justify-start text-left font-normal  text-xs text-muted-foreground", !date && "text-muted-foreground")}
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
};

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
