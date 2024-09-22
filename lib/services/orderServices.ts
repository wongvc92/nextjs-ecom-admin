import { eq } from "drizzle-orm";
import { db } from "../db";
import { orders as ordersTable } from "../db/schema/orders";

export const updateTrackingNumber = async (tracking: string, orderId: string) => {
  try {
    await db.update(ordersTable).set({ trackingNumber: tracking, status: "shipped" }).where(eq(ordersTable.id, orderId));
  } catch (error) {
    throw new Error("Failed update tracking number");
  }
};
