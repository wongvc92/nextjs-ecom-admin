import { getProductsId } from "@/lib/db/queries/store/products";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const productsId = await getProductsId();

    return NextResponse.json(productsId, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error, failed fetch productsId" }, { status: 500 });
  }
};
