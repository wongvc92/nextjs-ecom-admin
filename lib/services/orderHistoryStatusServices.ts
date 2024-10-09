import { db } from "../db";
import { orderStatusHistories as orderStatusHistoriesTable } from "../db/schema/orderStatusHistory";

export const createOrderStatusHistory = async (status: string, orderId: string) => {
  return await db.insert(orderStatusHistoriesTable).values({ orderId, status });
};
