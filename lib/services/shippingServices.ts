import Stripe from "stripe";

import { shippings as shippingsTable } from "@/lib/db/schema/shippings";

export const processShippings = async (session: Stripe.Checkout.Session, trx: any) => {
  try {
    if (session.shipping_details) {
      const shipping = session.shipping_details.address;
      await trx.insert(shippingsTable).values({
        address: shipping?.line1 as string,
        address2: shipping?.line2 ?? null,
        city: shipping?.city,
        state: shipping?.state,
        postalCode: shipping?.postal_code,
        country: shipping?.country ?? null,
        name: session.customer_details?.name ?? null,
        email: session.customer_details?.email ?? null,
        phone: session.customer_details?.phone ?? null,
        orderId: session.metadata?.orderId as string,
      });
    }
  } catch (error) {
    console.log("processShippings", error);
    throw new Error("Failed processShippings");
  }
};
