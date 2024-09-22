import { getOrderStatsCountByCustomerId } from "@/lib/db/queries/store/orders";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const userId = req.headers.get("X-User-ID");

  if (!userId) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }

  try {
    const data = await getOrderStatsCountByCustomerId(userId);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log("statscount", error);
    return NextResponse.json({ error: "Failed fetch stats count for orders" }, { status: 400 });
  }
};
