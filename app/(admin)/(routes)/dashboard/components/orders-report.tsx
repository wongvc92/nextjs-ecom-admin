import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { getOrdersReport } from "@/lib/db/queries/admin/orders";
import DateFilter from "./date-filter";
import StatusFilter from "@/components/status-filter";
import OrdersChart from "./orders-chart";

interface OrdersChartProps {
  ordersDateFrom: string;
  ordersDateTo: string;
  ordersStatus: string;
}

const OrderReport = async ({ ordersDateFrom, ordersDateTo, ordersStatus }: OrdersChartProps) => {
  const ordersReportData = await getOrdersReport(ordersDateFrom, ordersDateTo, ordersStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Orders <span className="text-sky-500">{ordersStatus} </span>per day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrdersChart ordersReportData={ordersReportData} />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          <span className="text-xs text-muted-foreground">
            {ordersDateFrom !== "" &&
              ordersDateTo !== "" &&
              `Showing orders from ${format(new Date(ordersDateFrom!), "dd/MM/yy")} to ${format(new Date(ordersDateTo!), "dd/MM/yy")}`}
          </span>
        </div>
        <div className="flex flex-rowitems-center  ml-auto gap-2">
          <StatusFilter paramsKey="ordersStatus" />
          <DateFilter dateFromParams="ordersDateFrom" dateToParams="ordersDateTo" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderReport;
