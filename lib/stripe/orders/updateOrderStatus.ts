import { orders as ordersTable } from "@/lib/db/schema/orders";
import { db } from "../../db";
import { eq } from "drizzle-orm";

export const updateOrderStatus = async (orderStatus: string, orderId: string) => {
  await db.update(ordersTable).set({ status: orderStatus }).where(eq(ordersTable.id, orderId!));
};
