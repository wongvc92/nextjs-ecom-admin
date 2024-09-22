import React, { Suspense } from "react";
import OrderItem from "./components/order-item";
import { unstable_cache } from "next/cache";
import { getOrderById } from "@/lib/db/queries/admin/orders";

interface OrderPageByIdProps {
  params: { orderId: string };
}

const getCachedOrderById = unstable_cache(async (id: string) => getOrderById(id), ["orders"], { tags: ["orders"] });

const OrderPageById: React.FC<OrderPageByIdProps> = async ({ params }) => {
  const order = await getCachedOrderById(params.orderId);

  return (
    <Suspense>
      <section className="w-full md:container">
        <OrderItem order={order} />
      </section>
    </Suspense>
  );
};

export default OrderPageById;
