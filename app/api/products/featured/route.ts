import { NextRequest, NextResponse } from "next/server";
import { getFeaturedProducts } from "@/lib/db/queries/store/products";

export async function GET(request: NextRequest) {
  try {
    const featuredProducts = await getFeaturedProducts();

    if (!featuredProducts) {
      return NextResponse.json({ error: "Featured Products not found" }, { status: 404 });
    }

    return NextResponse.json({ featuredProducts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
