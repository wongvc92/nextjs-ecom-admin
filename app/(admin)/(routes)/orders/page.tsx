import React, { Suspense } from "react";
import { OrderClient } from "./components/Client";
import OrderStats from "./components/order-stats";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import OrderTable from "./components/order-table";

const OrderPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  return (
    <section className="py-8 px-4 flex-col space-y-4 w-full">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Orders" description="Manage orders for your store" />
      </div>

      <Separator className="my-4" />
      <Suspense fallback={"loading..."}>
        <OrderStats />
      </Suspense>
      
      <OrderClient />
      <Suspense fallback={"loading..."}>
        <OrderTable searchParams={searchParams} />
      </Suspense>
    </section>
  );
};

export default OrderPage;
