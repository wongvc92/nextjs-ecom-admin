import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/db/queries/store/products";

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params;

    if (!productId) {
      return NextResponse.json({ error: "productId not found" }, { status: 404 });
    }

    const product = await getProductById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
