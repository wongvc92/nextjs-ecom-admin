import { OrderStatusEnumType } from "@/lib/db/schema/orders";
import { createOrderStatusHistory } from "@/lib/services/orderHistoryStatusServices";
import { updateOrderStatus } from "@/lib/services/orderServices";
import { NextRequest, NextResponse } from "next/server";

interface OrderStatusUpdate {
  status: string;
  id: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const data: OrderStatusUpdate = await req.json();

    const { id, status } = data;
    if (!id || !status) {
      return NextResponse.json({ error: "orderId or status is needed" }, { status: 400 });
    }

    await createOrderStatusHistory(status as OrderStatusEnumType, id);
    await updateOrderStatus(status as OrderStatusEnumType, id);
    return NextResponse.json({ success: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
