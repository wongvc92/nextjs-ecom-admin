import { ShipmentResponse } from "@/lib/db/types/courier";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const apiKey = process.env.TRACKING_MY_API_KEY!;

export const GET = async (req: NextRequest, { params }: { params: { order_number: string } }) => {
  const { order_number } = params;

  if (!order_number) {
    return NextResponse.json({ error: "Order number is required" }, { status: 400 });
  }
  const url = new URL(`${baseUrl}/api/v1/shipments/${order_number}`);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Tracking-Api-Key": apiKey,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch shipment details" }, { status: res.status });
    }
    const data: ShipmentResponse = await res.json();
    console.log(`shipment details for ${order_number}`, data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching shipment details: ", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
