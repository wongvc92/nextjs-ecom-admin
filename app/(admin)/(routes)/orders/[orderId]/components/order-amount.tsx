import { Order } from "@/lib/db/schema/orders";
import { findOrderItemsShippingSubTotal, findOrderItemsSubTotal } from "@/lib/helpers/orderItemHelpers";
import { currencyFormatter } from "@/lib/utils";
import { ReceiptText } from "lucide-react";
import React, { useMemo } from "react";

interface OrderAmountProps {
  order: Order;
}

const OrderAmount: React.FC<OrderAmountProps> = ({ order }) => {
  const memoizedOrderItemsSubTotal = useMemo(() => findOrderItemsSubTotal(order.orderItems), [order.orderItems]);
  const memoizedShippingFeeSubTotal = useMemo(() => findOrderItemsShippingSubTotal(order.orderItems), [order.orderItems]);
  const totalPrice = memoizedOrderItemsSubTotal + memoizedShippingFeeSubTotal;
  return (
    <div className="flex justify-between border rounded-md p-4 items-center bg-white dark:bg-black shadow-sm">
      <p className="flex items-center gap-2 font-semibold text-sm">
        <ReceiptText className="h-4 w-4" />
        Final Amount
      </p>
      <div>
        <span className="text-xl font-semibold text-orange-500">{currencyFormatter(totalPrice)}</span>
      </div>
    </div>
  );
};

export default OrderAmount;
