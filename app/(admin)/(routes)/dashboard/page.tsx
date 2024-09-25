import { Heading } from "@/components/ui/heading";
import OrderReport from "./components/orders-report";
import SalesReport from "./components/sales-report";
import TodoList from "./components/todo-list";
import { Suspense } from "react";
import StatsLoading from "@/components/loading/stats-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View activities for your store",
};

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
  const salesDateFrom = searchParams.salesDateFrom || "";
  const salesDateTo = searchParams.salesDateTo || "";
  const salesStatus = searchParams.salesStatus || "toShip";
  const ordersDateFrom = searchParams.ordersDateFrom || "";
  const ordersDateTo = searchParams.ordersDateTo || "";
  const ordersStatus = searchParams.ordersStatus || "toShip";

  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Dashboard" description="View activities for your store" />
      </div>
      <div className="space-y-4">
        <Suspense fallback={<StatsLoading />}>
          <TodoList />
        </Suspense>
        <div className="grid md:grid-cols-2  gap-4 w-full">
          <Suspense fallback={<Skeleton className="h-auto w-auto" />}>
            <SalesReport salesDateFrom={salesDateFrom} salesDateTo={salesDateTo} salesStatus={salesStatus} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-auto w-auto" />}>
            <OrderReport ordersDateFrom={ordersDateFrom} ordersDateTo={ordersDateTo} ordersStatus={ordersStatus} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
