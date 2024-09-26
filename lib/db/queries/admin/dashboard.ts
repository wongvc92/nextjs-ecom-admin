import { count, eq } from "drizzle-orm";
import { db } from "../..";
import { orders as ordersTable } from "../../schema/orders";
import { products as productsTable } from "../../schema/products";
import { cache } from "react";

export const getTodoListCount = cache(async () => {
  try {
    const [toShipCount] = await db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, "toShip"));

    const [shippedCount] = await db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, "shipped"));
    const [outofStockCount] = await db.select({ count: count() }).from(productsTable).where(eq(productsTable.isOutOfStock, true));
    return { toShipCount: toShipCount.count, shippedCount: shippedCount.count, outofStockCount: outofStockCount.count };
  } catch (error) {
    throw new Error("Something went wrong");
  }
});
