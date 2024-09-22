import { getOrdersReport, getSalesReport } from "@/lib/db/queries/admin/orders";
import TodoList from "./components/todo-list";
import { SalesChart } from "@/app/(admin)/(routes)/dashboard/components/sales-chart";
import { OrdersChart } from "@/app/(admin)/(routes)/dashboard/components/orders-chart";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: {
    ordersDateFrom: string;
    ordersDateTo: string;
    ordersStatus: string;
    salesDateFrom: string;
    salesDateTo: string;
    salesStatus: string;
  };
}) => {
  const ordersDateFrom = searchParams.ordersDateFrom || "";
  const ordersDateTo = searchParams.ordersDateTo || "";
  const ordersStatus = searchParams.ordersStatus || "shipped";
  const salesDateFrom = searchParams.salesDateFrom || "";
  const salesDateTo = searchParams.salesDateTo || "";
  const salesStatus = searchParams.salesStatus || "shipped";
  const salesReportData = await getSalesReport(salesDateFrom, salesDateTo, salesStatus);
  const ordersReportData = await getOrdersReport(ordersDateFrom, ordersDateTo, ordersStatus);

  const [salesReport, ordersReport] = await Promise.all([salesReportData, ordersReportData]);

  return (
    <div className="w-full py-8 px-4 min-h-screen">
      <div className="space-y-4">
        <TodoList />
        <div className="grid md:grid-cols-2  gap-4 w-full">
          <SalesChart salesReport={salesReport} />
          <OrdersChart ordersReport={ordersReport} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
