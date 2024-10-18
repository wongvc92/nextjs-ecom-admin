import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const apiKey = process.env.TRACKING_MY_API_KEY!;

export const GET = async () => {
  const url = new URL(`${baseUrl}/api/v1/webhook`);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Tracking-Api-Key": apiKey,
      },
      next: { tags: ["courier_webhook"] },
    });
    if (!res.ok) {
      const errorResponse = await res.json();
      console.log("Failed fetch webhook info: ", `${res.status} - ${res.statusText}`, errorResponse);
      return NextResponse.json({ error: res.statusText, details: errorResponse }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log("Internal server error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
