import { eq } from "drizzle-orm";
import { db } from "../..";
import { Shipping, shippings as shippingsTable } from "../../schema/shippings";

export const getShippingAddressByOrderId = async (orderId: string): Promise<Shipping | null> => {
  try {
    const [shippingAddress] = await db.select().from(shippingsTable).where(eq(shippingsTable.orderId, orderId));
    if (!shippingAddress) return null;
    return shippingAddress;
  } catch (error) {
    console.log("Failed fetch shipping address for orderId: ", orderId);
    return null;
  }
};
