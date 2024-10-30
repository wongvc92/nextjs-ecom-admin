import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/products";
import { count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const [productResult] = await db.select({ count: count() }).from(products);

    const productCount = productResult.count;

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
