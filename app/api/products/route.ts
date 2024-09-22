import { getProducts } from "@/lib/db/queries/store/products";
import { productsQuerySchema } from "@/lib/validation/productValidation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = Object.fromEntries(searchParams);
    console.log("product params", params);

    const validatedParams = productsQuerySchema.parse(params);
    const { productCounts, perPage, products } = await getProducts(validatedParams);
    if (!products || products.length === 0) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    return NextResponse.json({ products, productCounts, perPage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
