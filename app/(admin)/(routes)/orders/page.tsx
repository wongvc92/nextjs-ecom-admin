import React, { Suspense } from "react";
import { OrderClient } from "./components/Client";
import { getOrders, getOrderStatsCount } from "@/lib/db/queries/admin/orders";
import { orderQuerySchema, TOrdersQuery } from "@/lib/validation/orderValidation";

const OrderPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const { ordersData, orderCount } = await getOrders(searchParams as TOrdersQuery);
  const { allOrdersCount, cancelledOrdersCount, completedOrdersCount, pendingOrdersCount, shipppedOrdersCount, toShipOrdersCount } =
    await getOrderStatsCount();

  const perPage = (searchParams.perPage as string) || "5";
  return (
    <Suspense fallback="loading...">
      <OrderClient
        data={ordersData}
        orderCount={orderCount}
        totalPage={Math.ceil(orderCount / parseInt(perPage))}
        allOrdersCount={allOrdersCount}
        cancelledOrdersCount={cancelledOrdersCount}
        completedOrdersCount={completedOrdersCount}
        pendingOrdersCount={pendingOrdersCount}
        shipppedOrdersCount={shipppedOrdersCount}
        toShipOrdersCount={toShipOrdersCount}
      />
    </Suspense>
  );
};

export default OrderPage;
