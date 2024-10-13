import { OrderItem } from "@/lib/db/schema/orderItems";
import { findCartItemsShippingSubTotal, findCartItemsSubTotal } from "@/lib/helpers/cartItemHelpers";
import { recheckCartItems } from "@/lib/services/cartItemServices";
import { courierServices } from "@/lib/services/courierServices";
import { createOrderStatusHistory } from "@/lib/services/orderHistoryStatusServices";
import { createNewOrder } from "@/lib/services/orderServices";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/lib/types";
import { capitalizeSentenceFirstChar } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";
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

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL!;

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, toPostcode, courierChoice, totalWeightInKg } = await req.json();

    if (!cartItems || !customer) {
      return NextResponse.json({ error: "Failed checkout cart items" }, { status: 400 });
    }

    const checkoutCartItems = await recheckCartItems(cartItems);
    if (!checkoutCartItems) {
      return NextResponse.json({ error: "Failed checkout cart items" }, { status: 400 });
    }

    const courier = await courierServices({ toPostcode, courierChoice, totalWeightInKg });
    if (!courier) {
      return NextResponse.json({ error: "Failed to fetch courier, please try again" }, { status: 400 });
    }

    const cartItemsSubTotal = findCartItemsSubTotal(checkoutCartItems);
    const totalShippingInCents = courier[0].price;
    const totalPriceInCents = cartItemsSubTotal + totalShippingInCents;

    const newOrder = await createNewOrder({
      courierChoice,
      customerId: customer.customerId,
      productName: checkoutCartItems[0].product?.name ?? "",
      totalPriceInCents,
      image: checkoutCartItems[0].checkoutImage,
    });

    if (!newOrder) {
      return NextResponse.json({ error: "Failed to create a new order" }, { status: 400 });
    }

    await createOrderStatusHistory("pending", newOrder.id);

    const session = await stripe.checkout.sessions.create({
      metadata: {
        userId: customer.id,
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

      payment_method_types: ["card"],
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
          unit_amount: item.checkoutPriceInCents,
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
      success_url: `${STORE_URL}?success=1`,
      cancel_url: `${STORE_URL}?error=1`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: totalShippingInCents,
              currency: "myr",
            },
            display_name: courier[0].courier_title,
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
    });
    revalidatePath("/orders");
    revalidateTag("orders");
    return NextResponse.json(session, { headers: corsHeaders });
  } catch (error) {
    console.error("Error processing guest checkout", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
