import Stripe from "stripe";
import { shippings as shippingsTable } from "@/lib/db/schema/shippings";
import { db } from "../db";

export const createShippingAddress = async (session: Stripe.Checkout.Session) => {
  try {
    if (!session.shipping_details) return null;

    const shipping = session.shipping_details.address;
    await db.insert(shippingsTable).values({
      address: shipping?.line1 as string,
      address2: (shipping?.line2 as string) ?? null,
      city: shipping?.city as string,
      state: shipping?.state as string,
      postalCode: shipping?.postal_code as string,
      country: shipping?.country as string,
      name: session.customer_details?.name as string,
      email: session.customer_details?.email ?? null,
      phone: session.customer_details?.phone ?? null,
      orderId: session.metadata?.orderId as string,
      customerId: (session.customer as string) ?? null,
    });
  } catch (error) {
    console.log("processShippings", error);
    return null;
  }
};
