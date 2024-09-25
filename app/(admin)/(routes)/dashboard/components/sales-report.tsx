import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { getSalesReport } from "@/lib/db/queries/admin/orders";
import DateFilter from "./date-filter";
import StatusFilter from "@/components/status-filter";
import SalesChart from "./sales-chart";

interface SalesChartProps {
  salesDateFrom: string;
  salesDateTo: string;
  salesStatus: string;
}

const SalesReport = async ({ salesDateFrom, salesDateTo, salesStatus }: SalesChartProps) => {
  const salesReportData = await getSalesReport(salesDateFrom, salesDateTo, salesStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Sales <span className="text-sky-500">{salesStatus} </span>per day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SalesChart salesReportData={salesReportData} />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          <span className="text-xs text-muted-foreground">
            {salesDateFrom !== "" &&
              salesDateTo !== "" &&
              `Showing orders from ${format(new Date(salesDateFrom!), "dd/MM/yy")} to ${format(new Date(salesDateTo!), "dd/MM/yy")}`}
          </span>
        </div>
        <div className="flex flex-rowitems-center  ml-auto gap-2">
          <StatusFilter paramsKey="salesStatus" />
          <DateFilter dateFromParams="salesDateFrom" dateToParams="salesDateTo" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesReport;
