import { and, between, count, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "../..";
import { Order, orders as orderTables } from "../../schema/orders";
import { TOrdersQuery, orderQuerySchema } from "@/lib/validation/orderValidation";

export const getOrders = async (searchParams: TOrdersQuery): Promise<{ ordersData: Order[]; orderCount: number }> => {
  try {
    const parseResult = orderQuerySchema.safeParse(searchParams);

    if (!parseResult.success) {
      throw new Error("Invalid search parameters");
    }

    const { productName, dateFrom, dateTo, id, page, perPage, status } = parseResult.data;
    const whereCondition = [];

    if (id) {
      whereCondition.push(eq(orderTables.id, id));
    }

    if (!!status?.length && status.length > 0) {
      whereCondition.push(inArray(orderTables.status, status));
    }

    if (productName) {
      whereCondition.push(ilike(orderTables.productName, `%${productName}%`));
    }

    if (dateFrom && dateTo) {
      whereCondition.push(between(orderTables.createdAt, new Date(dateFrom), new Date(dateTo)));
    }

    const ordersData = await db.query.orders.findMany({
      where: whereCondition.length > 0 ? and(...whereCondition) : undefined,
      with: {
        orderItems: true,
        shippings: true,
      },
      limit: parseInt(perPage),
      offset: (parseInt(page) - 1) * parseInt(perPage),
    });

    const [orderCount] = await db
      .select({ count: count() })
      .from(orderTables)
      .where(whereCondition.length > 0 ? and(...whereCondition) : undefined);

    return { ordersData, orderCount: orderCount.count };
  } catch (error) {
    console.log(error);
    throw new Error("Failed fetch orders");
  }
};

export const getOrderIds = async () => {
  const orderIds = await db.select({ id: orderTables.id }).from(orderTables);
  return orderIds || [];
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orderTables.id, orderId),
      with: {
        orderItems: true,
        shippings: true,
      },
    });

    return order as Order;
  } catch (error) {
    throw new Error("Failed fetch order");
  }
};

export interface ISalesReport {
  day: number;
  totalAmountSum: number;
}

export const getSalesReport = async (salesDateFrom: string, salesDateTo: string, salesStatus: string): Promise<ISalesReport[]> => {
  try {
    const whereCondition = [];
    if (salesDateFrom && salesDateTo) {
      whereCondition.push(between(orderTables.updatedAt, new Date(salesDateFrom), new Date(salesDateTo)));
    }

    if (salesStatus !== "") {
      whereCondition.push(ilike(orderTables.status, `%${salesStatus}%`));
    }

    const salesReport: ISalesReport[] = await db
      .select({
        day: sql<number>`EXTRACT(DAY FROM ${orderTables.updatedAt})`,
        totalAmountSum: sql<number>`ROUND(SUM(${orderTables.amountInCents}) / 100.0, 2)`,
      })
      .from(orderTables)
      .where(whereCondition.length > 0 ? and(...whereCondition) : undefined)
      .groupBy(sql`EXTRACT(DAY FROM ${orderTables.updatedAt})`)
      .orderBy(sql`EXTRACT(DAY FROM ${orderTables.updatedAt})`);

    return salesReport;
  } catch (error) {
    throw new Error("Failed fetch complete dOrders By Month");
  }
};
export interface IOrdersReport {
  day: number;
  ordersCount: number;
}

export const getOrdersReport = async (ordersDateFrom: string, ordersDateTo: string, ordersStatus: string): Promise<IOrdersReport[]> => {
  try {
    const whereCondition = [];
    if (ordersDateFrom && ordersDateTo) {
      whereCondition.push(between(orderTables.updatedAt, new Date(ordersDateFrom), new Date(ordersDateTo)));
    }

    if (ordersStatus !== "") {
      whereCondition.push(ilike(orderTables.status, `%${ordersStatus}%`));
    }

    const ordersReport: IOrdersReport[] = await db
      .select({
        day: sql<number>`EXTRACT(DAY FROM ${orderTables.updatedAt})`,
        ordersCount: sql<number>`COUNT(${orderTables.id})`,
      })
      .from(orderTables)
      .where(whereCondition.length > 0 ? and(...whereCondition) : undefined)
      .groupBy(sql`EXTRACT(DAY FROM ${orderTables.updatedAt})`)
      .orderBy(sql`EXTRACT(DAY FROM ${orderTables.updatedAt})`);

    return ordersReport;
  } catch (error) {
    throw new Error("Failed fetch orders report");
  }
};

export const getOrderStatsCount = async () => {
  try {
    const [allOrders] = await db.select({ count: count() }).from(orderTables);
    const [cancelledOrders] = await db.select({ count: count() }).from(orderTables).where(eq(orderTables.status, "cancelled"));
    const [toShipOrders] = await db.select({ count: count() }).from(orderTables).where(eq(orderTables.status, "toShip"));
    const [pendingOrders] = await db.select({ count: count() }).from(orderTables).where(eq(orderTables.status, "pending"));
    const [shipppedOrders] = await db.select({ count: count() }).from(orderTables).where(eq(orderTables.status, "shipped"));
    const [completedOrders] = await db.select({ count: count() }).from(orderTables).where(eq(orderTables.status, "completed"));

    return {
      allOrdersCount: allOrders.count,
      cancelledOrdersCount: cancelledOrders.count,
      toShipOrdersCount: toShipOrders.count,
      pendingOrdersCount: pendingOrders.count,
      shipppedOrdersCount: shipppedOrders.count,
      completedOrdersCount: completedOrders.count,
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw new Error("Failed fetch order stats");
  }
};
