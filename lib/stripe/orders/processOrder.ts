import Stripe from "stripe";
import { db } from "../../db";
import { OrderItem } from "@/lib/db/schema/orderItems";
import { processShippings } from "../shippings/processShippings";
import { updateStock } from "./updateStock";
import { updateOrderStatus } from "./updateOrderStatus";
import { createOrderItem } from "./createOrderItem";

export const processOrder = async (session: Stripe.Checkout.Session, eventType: string) => {
  const orderDetails: OrderItem[] = session.metadata?.orderDetails ? JSON.parse(session.metadata.orderDetails) : [];
  if (eventType === "expired") {
    updateOrderStatus("cancelled", session.metadata?.orderId!);
  }
  if (eventType === "completed") {
    updateOrderStatus("toShip", session.metadata?.orderId!);

    await db.transaction(async (trx) => {
      await createOrderItem(trx, orderDetails, session.metadata?.orderId!);
      await updateStock(trx, orderDetails);
      await processShippings(session, trx);
    });
  }
};
