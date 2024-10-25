import { NextRequest, NextResponse } from "next/server";
import { orderQuerySchema } from "@/lib/validation/orderValidation";
import { getOrdersByCustomerId } from "@/lib/db/queries/store/orders";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-ID");

  if (!userId) {
    return NextResponse.json({ error: "Please login to retrive order" }, { status: 400 });
  }

  const { searchParams } = req.nextUrl;
  const params = Object.fromEntries(searchParams.entries());

  const parsed = orderQuerySchema.safeParse(params);

  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((err) => `${err.path.join(".")} - ${err.message}`).join("; ");

    console.error("errorMessage", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const existingOrder = await getOrdersByCustomerId(parsed.data, userId);

    return NextResponse.json({ orders: existingOrder.ordersData, ordersCount: existingOrder.orderCount }, { status: 200 });
  } catch (error: any) {
    return new NextResponse("[Failed fetch orders]", {
      status: 500,
    });
  }
}
