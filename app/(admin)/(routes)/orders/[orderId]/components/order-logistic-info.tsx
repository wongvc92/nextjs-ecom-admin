import { Circle, MapPin } from "lucide-react";
import { Order } from "@/lib/db/schema/orders";
import { format } from "date-fns";
import { ShipmentResponse } from "@/lib/db/types/couriers/shipmentResponse";

interface OrderLogisticInfoProps {
  order: Order;
}

const baseUrl = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const apiKey = process.env.TRACKING_MY_API_KEY!;

export const getShipmentByShippingOrderNumber = async (shippingOrderNumber: string) => {
  const url = new URL(`${baseUrl}/api/v1/shipments/${shippingOrderNumber}`);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Tracking-Api-Key": apiKey,
      },
    });
    const data = await res.json();
    const shipment: ShipmentResponse = data.shipment;

    return shipment;
  } catch (error) {
    return null;
  }
};

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
                Tracking no: <span className="text-muted-foreground font-light">{shipmentData.tracking?.tracking_number || ""}</span>
              </p>
              <p>
                Courier: <span className="text-muted-foreground font-light">{shipmentData.courier.title || ""}</span>
              </p>
            </div>
            <div className="bg-muted p-4 dark:border rounded-md shadow-sm my-2">
              <ul>
                {shipmentData?.tracking?.checkpoints?.map((checkpoint, i) => (
                  <li key={checkpoint.time} className="relative flex gap-6 pb-5 items-baseline">
                    <div className="before:absolute before:left-[16px]  before:h-full before:w-[1px] before:bg-muted-foreground">
                      <div className="bg-muted relative rounded-full p-1 text-center ">
                        <Circle
                          className={`z-10 ${i === 0 ? "text-lime-100" : "text-muted-foreground"}`}
                          fill={`${i === 0 ? "green" : "text-muted-foreground"}`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 w-full self-start py-1">
                      <p className={`"text-xs font-medium ${i === 0 ? "text-emerald-500" : "text-muted-foreground"}"`}>{checkpoint.location}</p>
                      <p className={`"text-xs font-medium ${i === 0 ? "text-emerald-500" : "text-muted-foreground"}"`}>{checkpoint.status}</p>
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
