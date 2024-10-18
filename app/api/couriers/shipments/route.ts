import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const apiKey = process.env.TRACKING_MY_API_KEY!;

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { shipping } = body;
  const url = new URL(`${baseUrl}/api/v1/shipments`);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Tracking-Api-Key": apiKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipping),
    });
    if (!res.ok) {
      const errorResponse = await res.json();
      console.log("Failed create shipment: ", `${res.status} - ${res.statusText}`, errorResponse);
      return NextResponse.json({ error: res.statusText, details: errorResponse }, { status: res.status });
    }
    const data = await res.json();
    console.log("data from shipment api", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log("Internal server error", error);
    return NextResponse.json({ error: "Internal server error: [Create shipment]" }, { status: 500 });
  }
};
