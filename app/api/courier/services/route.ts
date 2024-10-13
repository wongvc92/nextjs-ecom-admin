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
  const { toPostcode, totalWeightInKg, courierChoice } = parsed.data;

  try {
    const url = new URL(
      `${baseUrl}/api/v1/services?from_postcode=${51000}&to_postcode=${toPostcode}&weight=${totalWeightInKg}&from_country=MY&to_country=MY&type=normal&service_type=`
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
      console.log("Failed fetch Tracking list");
      return null;
    }

    const data = await res.json();

    console.log("data services", data.services);
    const filteredServices = data.services.filter((item: CourierService) => item.courier_title === courierChoice);
    console.log("filteredServices", filteredServices);
    return NextResponse.json(filteredServices as CourierService[], { status: 200 });
  } catch (error) {
    console.log("Failed fetch courier list: ", error);
    return NextResponse.json("Failed fetch courier list:", { status: 500 });
  }
};
