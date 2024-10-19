import { db } from "../db";

import { OrderStatusEnumType, orderStatusHistories as orderStatusHistoriesTable } from "../db/schema/orderStatusHistories";

export const createOrderStatusHistory = async (status: OrderStatusEnumType, orderId: string) => {
  return await db.insert(orderStatusHistoriesTable).values({ orderId, status });
};
