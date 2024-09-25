"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { IOrdersReport } from "@/lib/db/queries/admin/orders";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

const chartConfig = {
  ordersCount: {
    label: "Total Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface OrdersChartProps {
  ordersReportData: IOrdersReport[];
}
const OrdersChart = ({ ordersReportData }: OrdersChartProps) => {
  return (
    <>
      {ordersReportData.length === 0 ? (
        <div className="flex justify-center items-center bg-muted w-full py-20 rounded-md text-muted-foreground">No results</div>
      ) : (
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={ordersReportData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="ordersCount" fill="var(--color-ordersCount)" radius={8}>
              <LabelList position="top" offset={2} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
};

export default OrdersChart;
