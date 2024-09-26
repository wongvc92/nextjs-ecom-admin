import React, { Suspense } from "react";
import OrderStats from "./components/order-stats";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import OrderTable from "./components/order-table";
import { OrderFilters } from "./components/order-filters";
import StatsLoading from "@/components/loading/stats-loading";
import FiltersLoading from "@/components/loading/filters-loading";
import { Metadata } from "next";
import TableLoading from "@/components/loading/table-loading";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage orders for your store",
};

export const dynamic = "force-dynamic";

const OrderPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Orders" description="Manage orders for your store" />
      </div>
      <Separator className="my-4" />
      <Suspense fallback={<StatsLoading />}>
        <OrderStats />
      </Suspense>
      <Suspense fallback={<FiltersLoading />}>
        <OrderFilters />
      </Suspense>
      <Suspense fallback={<TableLoading />}>
        <OrderTable searchParams={searchParams} />
      </Suspense>
    </section>
  );
};

export default OrderPage;
