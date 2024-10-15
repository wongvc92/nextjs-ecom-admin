import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const apiKey = process.env.TRACKING_MY_API_KEY!;

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { order_numbers } = body;
  if (!order_numbers) {
    return NextResponse.json({ error: "Please provide order_numbers" }, { status: 400 });
  }
  const url = new URL(`${baseUrl}/api/v1/shipments/payments`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Tracking-Api-Key": apiKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_numbers }),
    });

    if (!res.ok) {
      console.log("Failed make shipments payment: ", `${res.status} - ${res.statusText}`);
      return NextResponse.json({ error: "Failed make shipments payment" }, { status: res.status, statusText: res.statusText || "" });
    }
    const data = await req.json();
    console.log(data);
  } catch (error) {
    console.log("Internal server error: [Shipment payment]", error);
    return NextResponse.json({ error: "Internal server error: [Shipment payment]" }, { status: 500 });
  }
};
