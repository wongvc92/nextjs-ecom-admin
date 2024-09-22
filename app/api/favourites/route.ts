import { IFavourite } from "@/lib/types";
import { NextResponse } from "next/server";
import { getProductById } from "@/lib/db/queries/store/products";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userFavouritesProductId } = body;

    if (!userFavouritesProductId) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
    }

    let favProducts = [];

    for (const item of userFavouritesProductId as IFavourite[]) {
      const { productId } = item;

      const data = await getProductById(productId);

      if (!data) {
        return NextResponse.json({ error: "No favourites" }, { status: 400 });
      }
      favProducts.push(data);
    }

    return NextResponse.json({ favProducts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
