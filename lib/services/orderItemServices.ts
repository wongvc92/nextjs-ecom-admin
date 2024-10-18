import { orderItems as orderItemsTable } from "@/lib/db/schema/orderItems";
import { db } from "../db";
import { ICheckoutCartItem } from "./cartItemServices";

export const createOrderItem = async (orderDetails: ICheckoutCartItem[], orderId: string) => {
  try {
    for (const item of orderDetails) {
      if (!orderId || !item.productId || !item.checkoutPriceInCents || !item.quantity) {
        throw new Error("Required fields cannot be undefined");
      }

      await db.insert(orderItemsTable).values({
        orderId: orderId,
        productId: item.productId,
        productName: item.product?.name ?? "",
        priceInCents: item.checkoutPriceInCents,
        quantity: item.quantity,
        image: item.checkoutImage,
        variationId: item.variationId !== "null" ? item.variationId : null,
        variationName: item.checkoutVariationName,
        variationLabel: item.checkoutVariationLabel,
        nestedVariationId: item.nestedVariationId !== "null" ? item.nestedVariationId : null,
        nestedVariationLabel: item.checkoutNestedVariationLabel,
        nestedVariationName: item.checkoutNestedVariationName,
      });
    }
  } catch (error) {
    console.log("createOrderItem", error);
    throw new Error("Failed update");
  }
};
