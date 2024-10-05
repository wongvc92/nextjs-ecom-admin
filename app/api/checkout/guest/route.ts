import { OrderItem } from "@/lib/db/schema/orderItems";
import { findCartItemsShippingSubTotal, findCartItemsSubTotal } from "@/lib/helpers/cartItemHelpers";
import { recheckCartItems } from "@/lib/services/cartItemServices";
import { createNewOrder } from "@/lib/services/orderServices";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/lib/types";
import { capitalizeSentenceFirstChar } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export interface ICheckoutCartItem extends CartItem {
  checkoutPriceInCents: number;
  checkoutShippingFeeInCents: number;
  checkoutNestedVariationName?: string;
  checkoutNestedVariationLabel?: string;
  checkoutVariationName?: string;
  checkoutVariationLabel?: string;
  checkoutImage: string;
}
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function POST(req: NextRequest) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems) {
      return NextResponse.json({ error: "Failed checkout cart items" }, { status: 400 });
    }
    const checkoutCartItems = await recheckCartItems(cartItems);
    if (!checkoutCartItems) {
      return NextResponse.json({ error: "Failed checkout cart items" }, { status: 400 });
    }
    const cartItemsSubTotal = findCartItemsSubTotal(checkoutCartItems);
    const totalShipping = findCartItemsShippingSubTotal(checkoutCartItems);
    const totalPriceInCents = cartItemsSubTotal + totalShipping;
    const customerId = "";

    const newOrder = await createNewOrder(
      customerId,
      checkoutCartItems[0].product?.name ?? "",
      totalPriceInCents,
      checkoutCartItems[0].checkoutImage
    );

    if (!newOrder) {
      return NextResponse.json({ error: "Failed to create a new order" }, { status: 400 });
    }
    const session = await stripe.checkout.sessions.create({
      metadata: {
        userId: "",
        orderId: newOrder.id,
        orderDetails: JSON.stringify(
          checkoutCartItems.map(
            (item) =>
              ({
                productId: item.productId,
                variationId: item.variationId,
                nestedVariationId: item.nestedVariationId,
                priceInCents: item.checkoutPriceInCents,
                quantity: item.quantity,
                shippingFeeInCents: item.checkoutShippingFeeInCents,
              } as OrderItem)
          )
        ),
      },

      line_items: checkoutCartItems.map((item) => ({
        price_data: {
          currency: "myr",
          product_data: {
            name: capitalizeSentenceFirstChar(item.product?.name as string),
            description: "Includes all items and shipping fee",
            images: [item.checkoutImage],
            metadata: {
              productId: item.productId,
              ...(item.checkoutVariationName && {
                variationName: item.checkoutVariationName,
              }),
              ...(item.checkoutNestedVariationName && {
                NestedVariationName: item.checkoutNestedVariationName,
              }),
            },
          },
          unit_amount: item.checkoutPriceInCents + item.checkoutShippingFeeInCents,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["MY"],
      },
      phone_number_collection: {
        enabled: true,
      },

      client_reference_id: `${newOrder.id}`,
      success_url: "http://localhost:3000?success=1",
      cancel_url: "http://localhost:3000?error=1",
    });
    revalidateTag("orders");
    return NextResponse.json(session, { headers: corsHeaders });
  } catch (error) {
    console.error("Error processing guest checkout", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
