import { and, asc, between, count, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "../..";
import { Order, OrderStatusEnumType, orders as orderTables } from "../../schema/orders";
import { TOrdersQuery } from "@/lib/validation/orderValidation";
import { unstable_cache } from "next/cache";

export const getOrdersByCustomerId = unstable_cache(
  async (searchParams: TOrdersQuery, customerId: string): Promise<{ ordersData: Order[]; orderCount: number }> => {
    const { productName, dateFrom, dateTo, id, page, perPage, status } = searchParams;
    const whereCondition = [eq(orderTables.customerId, customerId)];

    if (id) {
      whereCondition.push(eq(orderTables.id, id));
    }

    if (Array.isArray(status) && status.length > 0) {
      whereCondition.push(inArray(orderTables.status, status as OrderStatusEnumType[]));
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
        orderStatusHistories: true,
      },
      limit: parseInt(perPage),
      offset: (parseInt(page) - 1) * parseInt(perPage),
      orderBy: desc(orderTables.updatedAt),
    });

    const [orderCount] = await db
      .select({ count: count() })
      .from(orderTables)
      .where(whereCondition.length > 0 ? and(...whereCondition) : undefined);

    return { ordersData: ordersData || [], orderCount: orderCount.count };
  },
  ["orders"],
  {
    tags: ["orders"],
  }
);

export const getOrderStatsCountByCustomerId = unstable_cache(
  async (customerId: string) => {
    try {
      const [allOrders] = await db.select({ count: count() }).from(orderTables).where(eq(orderTables.customerId, customerId));
      const [cancelledOrders] = await db
        .select({ count: count() })
        .from(orderTables)
        .where(and(eq(orderTables.status, "cancelled"), eq(orderTables.customerId, customerId)));
      const [toShipOrders] = await db
        .select({ count: count() })
        .from(orderTables)
        .where(and(eq(orderTables.status, "to_ship"), eq(orderTables.customerId, customerId)));
      const [pendingOrders] = await db
        .select({ count: count() })
        .from(orderTables)
        .where(and(eq(orderTables.status, "pending"), eq(orderTables.customerId, customerId)));
      const [shippedOrders] = await db
        .select({ count: count() })
        .from(orderTables)
        .where(and(eq(orderTables.status, "shipped"), eq(orderTables.customerId, customerId)));
      const [completedOrders] = await db
        .select({ count: count() })
        .from(orderTables)
        .where(and(eq(orderTables.status, "completed"), eq(orderTables.customerId, customerId)));

      return {
        allOrdersCount: allOrders.count,
        cancelledOrdersCount: cancelledOrders.count,
        toShipOrdersCount: toShipOrders.count,
        pendingOrdersCount: pendingOrders.count,
        shippedOrdersCount: shippedOrders.count,
        completedOrdersCount: completedOrders.count,
      };
    } catch (error) {
      console.error("Failed to fetch order stats:", error);
      throw new Error("Failed fetch product stats");
    }
  },
  ["orders"],
  {
    tags: ["orders"],
  }
);

export const getOrderById = unstable_cache(
  async (orderId: string): Promise<Order | null> => {
    const order = await db.query.orders.findFirst({
      where: and(eq(orderTables.id, orderId)),
      with: {
        orderItems: true,
        shippings: true,
      },
    });

    return order || null;
  },
  ["orders"],
  {
    tags: ["orders"],
  }
);
