import { Circle, MapPin } from "lucide-react";
import { Order } from "@/lib/db/schema/orders";
import { format } from "date-fns";
import { getShipmentByShippingOrderNumber } from "@/lib/db/queries/admin/couriers";

interface OrderLogisticInfoProps {
  order: Order;
}

const OrderLogisticInfo = async ({ order }: OrderLogisticInfoProps) => {
  const shipmentData = await getShipmentByShippingOrderNumber(order.shippingOrderNumber as string);
  return (
    <div className="flex">
      <div className="flex flex-col space-y-2">
        <p className="flex items-center gap-2  font-semibold text-sm">
          <MapPin className="h-4 w-4" />
          Logistic Information
        </p>
        {!shipmentData && order.status === "to_ship" && <p className="pl-6 text-sm text-muted-foreground">Seller is preparing to ship your order</p>}
        {shipmentData && (
          <div className="pl-6">
            <div className="text-sm my-2">
              <p className="flex items-center gap-2">
                Tracking no: <span className="text-muted-foreground font-light">{shipmentData.shipment.tracking?.tracking_number || ""}</span>
              </p>
              <p>
                Courier: <span className="text-muted-foreground font-light">{shipmentData.shipment.courier.title || ""}</span>
              </p>
            </div>
            <div className="bg-muted p-4 dark:border rounded-md shadow-sm my-2">
              <ul>
                {shipmentData?.shipment?.tracking?.checkpoints?.map((checkpoint, i) => (
                  <li key={checkpoint.time} className="relative flex gap-6 pb-5 items-baseline">
                    <div className="before:absolute before:left-[16px]  before:h-full before:w-[1px] before:bg-muted-foreground">
                      <div className="bg-muted relative rounded-full p-1 text-center ">
                        <Circle className="z-10 text-emerald-100" fill="green" />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 w-full self-start py-1">
                      <p className="text-xs font-medium text-emerald-500">{checkpoint.location}</p>
                      <p className="text-xs font-medium text-emerald-500">{checkpoint.status}</p>
                      <span className="text-[12px] text-muted-foreground">{format(checkpoint.time, "DD/MM/YY MM:HH")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderLogisticInfo;
