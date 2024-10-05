import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";
import { processOrder } from "@/lib/services/orderServices";

// Define the POST route handler
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Verify the signature sent by Stripe
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    return new NextResponse(`Webhook Error`, { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;

  try {
    if (event.type === "checkout.session.expired") {
      await processOrder(session, "expired");
    } else if (event.type === "checkout.session.completed") {
      await processOrder(session, "completed");
    }

    revalidatePath("/orders");
    
    return new NextResponse("Updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating order or shipping information:", error);
    return new NextResponse("Failed to update order or shipping information", { status: 500 });
  }
}
