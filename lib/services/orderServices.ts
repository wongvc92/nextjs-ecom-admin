import { eq } from "drizzle-orm";
import { db } from "../db";
import { orders as ordersTable } from "../db/schema/orders";
import Stripe from "stripe";
import { OrderItem } from "../db/schema/orderItems";
import { createOrderItem } from "./orderItemServices";
import { updateStock } from "./productServices";
import { processShippings } from "./shippingServices";
import { createOrderStatusHistory } from "./orderHistoryStatusServices";

export const updateTrackingNumber = async (tracking: string, orderId: string) => {
  try {
    await db.update(ordersTable).set({ trackingNumber: tracking, status: "shipped" }).where(eq(ordersTable.id, orderId));
  } catch (error) {
    throw new Error("Failed update tracking number");
  }
};

export const createNewOrder = async (customerId: string, productName: string, totalPriceInCents: number, image: string) => {
  const [newOrder] = await db
    .insert(ordersTable)
    .values({
      courierName: null,
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
    await updateOrderStatus("toShip", session.metadata?.orderId!);
    await createOrderStatusHistory("toShip", session.metadata?.orderId!);
    await createOrderItem(orderDetails, session.metadata?.orderId!);

    await updateStock(orderDetails);
    await processShippings(session);
  }
};

export const updateOrderStatus = async (orderStatus: string, orderId: string) => {
  return await db.update(ordersTable).set({ status: orderStatus }).where(eq(ordersTable.id, orderId!));
};
