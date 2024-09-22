"use client";

import { Order } from "@/lib/db/schema/orders";
import { currencyFormatter } from "@/lib/utils";
import { findOrderItemSubTotal } from "@/lib/utils/orders";
import { ImageIcon, LucideBadgeDollarSign } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";

const OrderPaymentInfo = ({ order }: { order: Order }) => {
  const memoizedSubTotals: number[] = useMemo(() => {
    return order.orderItems.map((item) => {
      return findOrderItemSubTotal(Number(item.quantity), Number(item.priceInCents));
    });
  }, [order.orderItems]);

  return (
    <div className="border rounded-md p-4 space-y-4 bg-white dark:bg-black shadow-sm ">
      <p className="flex items-center gap-2  font-semibold text-sm">
        <LucideBadgeDollarSign />
        Payment Information
      </p>
      <div className=" relative overflow-auto border rounded-sm">
        <table className="w-full">
          <thead className="bg-muted text-muted-foreground">
            <tr className="border-b ">
              <th className=" p-2 font-normal text-xs ">No.</th>
              <th className=" p-2 font-normal text-xs">Image</th>
              <th className="p-2 font-normal text-xs">Product(s)</th>
              <th className="p-2 font-normal text-xs">Variation 1</th>
              <th className="p-2 font-normal text-xs">Variation 2</th>
              <th className="p-2 font-normal text-xs">Unit Price</th>
              <th className="p-2 font-normal text-xs">Quantity</th>
              <th className=" p-2 font-normal text-xs">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, i) => (
              <tr key={item.id} className="border-b ">
                <td className="p-4 font-normal text-xs text-center">{i + 1}</td>
                <td className="p-4  flex justify-center items-center">
                  <div className="rounded-md h-[100px] w-[100px] relative overflow-hidden">
                    {item.image ? <Image src={item.image} alt={`Order item image-${i}`} fill className="object-cover" /> : <ImageIcon />}
                  </div>
                </td>
                <td className="p-4  font-normal text-xs text-center">{item.productName}</td>
                <td className="p-4  font-normal text-xs text-center">{item.variationName}</td>
                <td className="p-4  font-normal text-xs text-center">{item.nestedVariationName}</td>
                <td className="p-4 font-normal text-xs text-center">{currencyFormatter(item.priceInCents)}</td>
                <td className="p-4 font-normal text-xs text-center">{item.quantity}</td>
                <td className="p-4 font-normal text-xs text-center">{currencyFormatter(memoizedSubTotals[i])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderPaymentInfo;
