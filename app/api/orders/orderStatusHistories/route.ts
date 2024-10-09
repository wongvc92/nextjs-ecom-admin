import { getOrderStatusHistoriesByOrderId } from "@/lib/db/queries/store/orderStatusHistories";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const orderId = req.headers.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId is needed" }, { status: 400 });
    }

    const orderStatusHistory = await getOrderStatusHistoriesByOrderId(orderId);

    return NextResponse.json({ orderStatusHistory: orderStatusHistory || null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
