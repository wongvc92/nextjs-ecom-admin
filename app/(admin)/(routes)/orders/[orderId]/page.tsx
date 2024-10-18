import { getOrderById, getOrderIds } from "@/lib/db/queries/admin/orders";
import { HashIcon, MapPin, ScrollText } from "lucide-react";
import OrderLogisticInfo from "./components/order-logistic-info";
import OrderPaymentInfo from "./components/order-payment-info";
import OrderHistory from "./components/order-history";
import OrderAmount from "./components/order-amount";
import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getShipmentByShippingOrderNumber } from "@/lib/db/queries/admin/couriers";
import ShipButton from "../components/ship-button";

export const metadata: Metadata = {
  title: "View order",
  description: "Manage orders for your store",
};

export const generateStaticParams = async () => {
  const orderIds = await getOrderIds();
  if (!orderIds) return [];
  return orderIds.map((order) => ({
    orderId: order.id,
  }));
};

const OrderPageById = async ({ params }: { params: { orderId: string } }) => {
  const order = await getOrderById(params.orderId);

  if (!order) {
    return <div>No orders</div>;
  }

  return (
    <section className="w-full md:container">
      <div className="flex flex-col xl:flex-row  py-10 px-4 gap-4">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-between items-center border rounded-md p-4 bg-white shadow-sm dark:bg-black">
            <p className="flex items-center gap-2 font-semibold text-sm capitalize">
              <ScrollText className="h-4 w-4 " />
              {order.status.split("_").join(" ")}
            </p>
            {order.status === "to_ship" && <ShipButton order={order} />}
          </div>
          <div className="flex flex-col space-y-8 border p-4 rounded-md  bg-white dark:bg-black shadow-sm">
            <div className="flex">
              <div className="flex flex-col">
                <p className="flex items-center gap-2 font-semibold text-sm">
                  <HashIcon className="h-4 w-4 " /> Order Id
                </p>
                <div className="pl-6">
                  <span className="text-muted-foreground text-xs">{order.id}</span>
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col">
                <p className="flex items-center gap-2  font-semibold text-sm">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </p>
                <div className="pl-6">
                  {order && order.shippings.length ? (
                    <span className="text-muted-foreground text-xs">
                      {`${order?.shippings[0]?.address}, ${order?.shippings[0]?.address2}, ${order?.shippings[0]?.postalCode}, ${order?.shippings[0]?.city}, ${order?.shippings[0]?.state}`}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            {/* Logistic Information */}
            <OrderLogisticInfo order={order} />
          </div>

          {/* Payment Information */}
          <OrderPaymentInfo order={order} />
          {/* Final Amount */}
          <OrderAmount order={order} />
        </div>

        {/* order history */}
        <Suspense fallback={<Skeleton className="xl:w-1/3 rounded-md h-[500px]" />}>
          <OrderHistory orderId={order.id} />
        </Suspense>
      </div>
    </section>
  );
};

export default OrderPageById;
