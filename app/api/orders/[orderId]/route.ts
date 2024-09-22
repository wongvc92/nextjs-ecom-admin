import { validate as isUuid } from "uuid";

import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db/queries/store/orders";

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json({ error: "orderId not found" }, { status: 400 });
    }

    if (!isUuid(orderId)) {
      return NextResponse.json({ error: "Invalid Order ID format" }, { status: 400 });
    }

    const data = await getOrderById(orderId);

    if (!data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
