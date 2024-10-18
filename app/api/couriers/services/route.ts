import { getDefaultSender } from "@/lib/db/queries/admin/senders";
import { CourierService } from "@/lib/types";
import { CourierRequest, courierRequestSchema } from "@/lib/validation/courierValidation";
import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const apiKey = process.env.TRACKING_MY_API_KEY!;

export const POST = async (req: NextRequest) => {
  const body: CourierRequest = await req.json();

  const parsed = courierRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
  const { toPostcode, totalWeightInKg, courierChoice, totalHeight, totalLength, totalWidth } = parsed.data;

  const sender = await getDefaultSender();
  if (!sender) {
    return NextResponse.json({ error: "Sender info needed" }, { status: 400 });
  }
  try {
    const url = new URL(
      `${baseUrl}/api/v1/services?from_postcode=${sender.postcode}&to_postcode=${toPostcode}&weight=${totalWeightInKg}&${totalLength}&${totalWidth}&${totalHeight}&from_country=MY&to_country=MY&type=normal&service_type=drop_off`
    );
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Tracking-Api-Key": apiKey,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorResponse = await res.json();
      console.log("Failed create shipment: ", `${res.status} - ${res.statusText}`, errorResponse);
      return NextResponse.json({ error: res.statusText, details: errorResponse }, { status: res.status });
    }

    const data = await res.json();

    const filteredServices = data.services.filter((item: CourierService) => item.courier_title === courierChoice);

    return NextResponse.json(filteredServices as CourierService[], { status: 200 });
  } catch (error) {
    console.log("Failed fetch courier list: ", error);
    return NextResponse.json({ error: "Failed fetch courier list:" }, { status: 500 });
  }
};
