import { eq } from "drizzle-orm";
import { db } from "../db";
import { orders as ordersTable, OrderStatusEnumType } from "../db/schema/orders";
import Stripe from "stripe";
import { OrderItem } from "../db/schema/orderItems";
import { updateStock } from "./productServices";
import { createShippingAddress } from "./shippingServices";
import { createOrderStatusHistory } from "./orderHistoryStatusServices";

export const updateTrackingNumberByOrderId = async (tracking: string, orderId: string) => {
  try {
    await db.update(ordersTable).set({ trackingNumber: tracking, status: "shipped" }).where(eq(ordersTable.id, orderId));
  } catch (error) {
    throw new Error("Failed update tracking number");
  }
};

export const updateShippingOrderNumber = async (shippingOrderNumber: string, orderId: string) => {
  return await db.update(ordersTable).set({ shippingOrderNumber }).where(eq(ordersTable.id, orderId!));
};

interface CreateNewOrderProps {
  courierServiceId: number;
  totalWeightInGram: number;
  subtotalInCents: number;
  totalShippingInCents: number;
  courierChoice: string;
  customerId: string;
  productName: string;
  totalPriceInCents: number;
  image: string;
}
export const createNewOrder = async ({
  courierServiceId,
  customerId,
  productName,
  totalPriceInCents,
  image,
  courierChoice,
  subtotalInCents,
  totalShippingInCents,
  totalWeightInGram,
}: CreateNewOrderProps) => {
  const [newOrder] = await db
    .insert(ordersTable)
    .values({
      courierServiceId,
      totalWeightInGram,
      subtotalInCents,
      totalShippingInCents,
      courierName: courierChoice,
      trackingNumber: null,
      customerId: customerId,
      status: "pending",
      productName: productName,
      amountInCents: totalPriceInCents,
      image: image,
    })
    .returning();
  await createOrderStatusHistory(newOrder.status, newOrder.id);
  return newOrder;
};

export const processOrder = async (session: Stripe.Checkout.Session, eventType: string) => {
  const orderDetails: OrderItem[] = session.metadata?.orderDetails ? JSON.parse(session.metadata.orderDetails) : [];

  if (eventType === "expired") {
    await updateOrderStatus("cancelled", session.metadata?.orderId!);
  }
  if (eventType === "completed") {
    await updateOrderStatus("to_ship", session.metadata?.orderId!);
    await createOrderStatusHistory("to_ship", session.metadata?.orderId!);
    await updateStock(orderDetails);
    await createShippingAddress(session);
  }
};

export const updateOrderStatus = async (orderStatus: OrderStatusEnumType, orderId: string) => {
  return await db.update(ordersTable).set({ status: orderStatus }).where(eq(ordersTable.id, orderId!));
};

export const deleteOrderDB = async (id: string) => {
  return await db.delete(ordersTable).where(eq(ordersTable.id, id));
};
