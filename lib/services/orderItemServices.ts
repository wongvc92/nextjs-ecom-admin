import { getProductById } from "@/lib/db/queries/admin/products";
import { OrderItem, orderItems as orderItemsTable } from "@/lib/db/schema/orderItems";
import { Product } from "@/lib/db/schema/products";
import {
  findOrderItemdNestedVariationLabel,
  findOrderItemdNestedVariationName,
  findOrderItemdProductImage,
  findOrderItemdVariationLabel,
  findOrderItemdVariationName,
} from "../helpers/orderItemHelpers";
import { db } from "../db";

export const createOrderItem = async (orderDetails: OrderItem[], orderId: string) => {
  try {
    for (const item of orderDetails) {
      const product = await getProductById(item.productId);
      const variationName = findOrderItemdVariationName(item.variationId!, product as Product);
      const variationLabel = findOrderItemdVariationLabel(item.variationId!, product as Product);
      const nestedVariationName = findOrderItemdNestedVariationName(item.variationId!, item.nestedVariationId!, product as Product);
      const nestedVariationLabel = findOrderItemdNestedVariationLabel(item.variationId!, item.nestedVariationId!, product as Product);
      const image = findOrderItemdProductImage(item.variationId!, product as Product);
      const productName = product?.name;

      if (!orderId || !item.productId || !item.priceInCents || !item.quantity) {
        throw new Error("Required fields cannot be undefined");
      }

      if (!product) {
        throw new Error(`Product not found for ID: ${item.productId}`);
      }
      await db.insert(orderItemsTable).values({
        orderId: orderId,
        productId: item.productId,
        productName: productName ?? "",
        priceInCents: item.priceInCents,
        quantity: item.quantity,
        image,
        variationId: item.variationId !== "null" ? item.variationId : null,
        variationName,
        variationLabel,
        nestedVariationId: item.nestedVariationId !== "null" ? item.nestedVariationId : null,
        nestedVariationLabel,
        nestedVariationName,
        shippingFeeInCents: item.shippingFeeInCents,
      });
    }
  } catch (error) {
    console.log("createOrderItem", error);
    throw new Error("Failed update");
  }
};
