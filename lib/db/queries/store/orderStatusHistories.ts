import { db } from "../..";
import { orderStatusHistories as orderStatusHistoriesTable, OrderStatusHistory } from "../../schema/orderStatusHistory";
import { asc, eq } from "drizzle-orm";

export const getOrderStatusHistoriesByOrderId = async (orderId: string): Promise<OrderStatusHistory[] | null> => {
  console.log(orderId);
  const orderStatusHistories = await db
    .select()
    .from(orderStatusHistoriesTable)
    .where(eq(orderStatusHistoriesTable.orderId, orderId))
    .orderBy(asc(orderStatusHistoriesTable.createdAt));

  if (!orderStatusHistories) return null;
  console.log("orderStatusHistories", orderStatusHistories);
  return orderStatusHistories;
};
