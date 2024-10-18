import { CheckpointStatus, Tracking } from "@/lib/db/types/couriers/trackingCheckpointUpdate";
import { EventOptions } from "@/lib/db/types/couriers/webhook";
import { createOrderStatusHistory } from "@/lib/services/orderHistoryStatusServices";
import { updateOrderStatus } from "@/lib/services/orderServices";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const secret = req.nextUrl.searchParams.get("secret");

    if (secret !== process.env.TRACKING_MY_WEBHOOK_SECRET_KEY!) {
      console.log("Incorrect secret key");
      return NextResponse.json({ error: "Incorrect secret key" }, { status: 400 });
    }
    const event: EventOptions = body.event;

    if (event === EventOptions.TrackingCheckpointUpdate) {
      const tracking: Tracking = body.tracking;
      if (!tracking) return;
      if (tracking.latest_checkpoint && tracking.latest_checkpoint.status === CheckpointStatus.Delivered) {
        if (!tracking.order_id) {
          console.log("Failed update order status and create order status history, missing tracking order id");
          return NextResponse.json(
            { error: "Failed update order status and create order status history, missing tracking order id" },
            { status: 400 }
          );
        }
        await updateOrderStatus("completed", tracking.order_id);
        await createOrderStatusHistory("completed", tracking.order_id);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
