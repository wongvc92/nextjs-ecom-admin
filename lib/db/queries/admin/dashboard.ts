import { count, eq } from "drizzle-orm";
import { db } from "../..";
import { orders as ordersTable } from "../../schema/orders";
import { products as productsTable } from "../../schema/products";

export const getTodoListCount = async () => {
  try {
    const [toShipCount] = await db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, "to_ship"));

    const [shippedCount] = await db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, "shipped"));
    const [outofStockCount] = await db.select({ count: count() }).from(productsTable).where(eq(productsTable.isOutOfStock, true));
    return { toShipCount: toShipCount.count, shippedCount: shippedCount.count, outofStockCount: outofStockCount.count };
  } catch (error) {
    return { toShipCount: 0, shippedCount: 0, outofStockCount: 0 };
  }
};
