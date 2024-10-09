import { db } from "../..";
import { orderStatusHistories as orderStatusHistoriesTable, OrderStatusHistory } from "../../schema/orderStatusHistory";
import { asc, eq } from "drizzle-orm";

export const getOrderStatusHistoriesByOrderId = async (orderId: string): Promise<OrderStatusHistory[] | null> => {
  const orderStatusHistories = await db
    .select()
    .from(orderStatusHistoriesTable)
    .where(eq(orderStatusHistoriesTable.orderId, orderId))
    .orderBy(asc(orderStatusHistoriesTable.createdAt));

  if (!orderStatusHistories) return null;

  return orderStatusHistories;
};
