import { getOrderStatusHistoriesByOrderId } from "@/lib/db/queries/admin/orderStatusHistories";
import { format } from "date-fns";
import { CheckCircle, DollarSign, ReceiptText, ShieldCheck } from "lucide-react";
import React from "react";

const OrderHistory = async ({ orderId }: { orderId: string }) => {
  const orderStatusHistories = await getOrderStatusHistoriesByOrderId(orderId);

  if (!orderStatusHistories) {
    return <div className="xl:w-1/3  bg-white dark:bg-inherit shadow-sm p-4 border rounded-md space-y-4 h-fit">No data</div>;
  }

  const findOrderStatus = (status: string) => {
    return orderStatusHistories.find((item) => item.status === status)?.status ?? null;
  };

  const findOrderTimestamp = (status: string) => {
    const timeStamp = orderStatusHistories.find((item) => item.status === status)?.createdAt;
    if (!timeStamp) {
      return null;
    }
    const formattedTimeStamp = format(timeStamp, "dd/MM/yy HH:mm");
    return formattedTimeStamp;
  };

  const STATUS_HISTORY = [
    {
      id: 1,
      status: findOrderStatus("pending"),
      title: "New Order",
      description: "order has been created and pending payment",
      timeStamp: findOrderTimestamp("pending"),
      icon: ReceiptText,
    },
    {
      id: 2,
      status: findOrderStatus("toShip"),
      title: "Buyer confirmed order received",
      description: "payment has been received and shipment is being processed.",
      timeStamp: findOrderTimestamp("toShip"),
      icon: DollarSign,
    },
    {
      id: 3,
      status: findOrderStatus("shipped"),
      title: "Process shipment",
      description: "Product is submitted to courier for shipment",
      timeStamp: findOrderTimestamp("shipped"),
      icon: ShieldCheck,
    },
    {
      id: 4,
      status: findOrderStatus("completed"),
      title: "Parcel delivered",
      description: "Buyer confirmed parcel delivered and received",
      timeStamp: findOrderTimestamp("completed"),
      icon: CheckCircle,
    },
  ];

  const STATUS_HISTORY_AVAILABLE = STATUS_HISTORY.filter((status) => status.status !== null).reverse();
  return (
    <div className="xl:w-1/3  bg-white dark:bg-inherit shadow-sm p-4 border rounded-md space-y-4 h-fit">
      <div className="flex justify-center">
        <p className="text-sm font-semibold">ORDER HISTORY</p>
      </div>
      <ul>
        {STATUS_HISTORY_AVAILABLE.map((status, i) => (
          <li className="relative flex gap-6 pb-5 items-baseline" key={status.id}>
            <div
              className={`before:absolute before:left-[16px]  before:h-full before:w-[1px] before:bg-muted-foreground ${
                i === STATUS_HISTORY_AVAILABLE.length - 1 && "before:bg-transparent"
              }`}
            >
              <div className={`relative rounded-full p-1 text-center ${i === 0 ? "bg-emerald-500" : "bg-muted-foreground"}`}>
                <status.icon className="z-10 text-white" />
              </div>
            </div>
            <div className="flex flex-col space-y-1 w-full self-start">
              <p className={`text-xs font-medium ${i === 0 ? "text-emerald-500" : "text-muted-foreground"}`}>{status.title}</p>
              <span className="text-[12px] text-muted-foreground">{status.description}</span>
              <span className="text-[12px] text-muted-foreground">{status.timeStamp}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
