"use client";

import { Order } from "@/lib/db/schema/orders";
import { findOrderItemSubTotal } from "@/lib/helpers/orderItemHelpers";
import { currencyFormatter } from "@/lib/utils";
import { ImageIcon, LucideBadgeDollarSign } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

const OrderPaymentInfo = ({ order }: { order: Order }) => {
  const [imgError, setImgError] = useState(false);
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
                    {item.image && !imgError ? (
                      <Image src={item.image} alt={`Order item image-${i}`} fill className="object-cover" onError={() => setImgError(true)} />
                    ) : (
                      <ImageIcon className="w-full h-full object-contain text-gray-300" />
                    )}
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
            <tr className="hidden md:table-row">
              <td colSpan={8} className="p-4">
                <div className="flex justify-end">
                  <div className="space-y-2 text-xs flex flex-col">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Order total</span>
                      <span>{currencyFormatter(order.subtotalInCents)}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Shipping total</span>
                      <span>{currencyFormatter(order.totalShippingInCents)}</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            {/* For small screens */}
            <tr className="table-row md:hidden">
              <td colSpan={3} className="p-4">
                <div className="flex justify-end">
                  <div className="space-y-2 text-xs flex flex-col">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Order total</span>
                      <span>{currencyFormatter(order.subtotalInCents)}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Shipping total</span>
                      <span>{currencyFormatter(order.totalShippingInCents)}</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderPaymentInfo;
