import { NextRequest, NextResponse } from "next/server";
import { getproductsCount } from "@/lib/db/queries/store/products";

export async function GET(request: NextRequest) {
  try {
    const productCount = await getproductsCount();

    return NextResponse.json({ productCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
