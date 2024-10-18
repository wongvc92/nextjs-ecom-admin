import { getOrderIdByTrackingNumber } from "@/lib/db/queries/admin/orders";
import { CheckpointStatus, Tracking } from "@/lib/db/types/couriers/trackingCheckpointUpdate";
import { EventOptions } from "@/lib/db/types/couriers/webhook";
import { createOrderStatusHistory } from "@/lib/services/orderHistoryStatusServices";
import { updateOrderStatus } from "@/lib/services/orderServices";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const event: EventOptions = body.event;

    if (event === EventOptions.TrackingCheckpointUpdate) {
      const tracking: Tracking = body.tracking;
      if (!tracking) return;
      if (tracking.latest_checkpoint && tracking.latest_checkpoint.status === CheckpointStatus.Delivered) {
        const data = await getOrderIdByTrackingNumber(tracking.tracking_number);
        await updateOrderStatus("completed", data.id);
        await createOrderStatusHistory("completed", data.id);
      }

      console.log("TrackingCheckpointUpdate", tracking);
    }

    if (event === EventOptions.ShipmentCreate) {
      const shipment = body.shipment;
      console.log("shipment created webook", shipment);
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
