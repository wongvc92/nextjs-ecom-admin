import { db } from "@/lib/db";
import { orders as ordersTable } from "@/lib/db/schema/orders";

export const createNewOrder = async (customerId: string, productName: string, totalPriceInCents: number, image: string) => {
  const [newOrder] = await db
    .insert(ordersTable)
    .values({
      courierName: null,
      trackingNumber: null,
      customerId: customerId,
      status: "pending",
      productName: productName,
      amountInCents: totalPriceInCents,
      image: image,
    })
    .returning();

  return newOrder;
};
