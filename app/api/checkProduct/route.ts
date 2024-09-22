import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/db/queries/store/products";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { productId, selectedVariationId, selectedNestedVariationId, variationType } = body;

    console.log(body);

    if (!productId) {
      return NextResponse.json({ error: "productId is undefined" }, { status: 400 });
    }

    const existingProduct = await getProductById(productId);

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "product not found ",
        },
        { status: 400 }
      );
    }

    const maxPurchase = existingProduct.maxPurchase;
    const isArchived = existingProduct.isArchived;
    let stockCount;

    if (variationType === "NESTED_VARIATION") {
      const foundVariation = existingProduct.variations?.find((v) => v.id === selectedVariationId);
      if (!foundVariation) {
        console.error("variation not found for variationId: ", selectedVariationId);
        return NextResponse.json(
          {
            error: "variation not found ",
          },
          { status: 400 }
        );
      }
      const foundNestedVariation = foundVariation?.nestedVariations?.find((nv) => nv.id === selectedNestedVariationId);
      if (!foundNestedVariation) {
        console.error("variation not found for nestedVariationId: ", selectedNestedVariationId);
        return NextResponse.json(
          {
            error: "Nested variation not found ",
          },
          { status: 400 }
        );
      }
      stockCount = foundNestedVariation.stock;
    } else if (variationType === "VARIATION") {
      const foundVariation = existingProduct.variations?.find((v) => v.id === selectedVariationId);
      if (!foundVariation) {
        console.error("variation not found for variationId: ", selectedVariationId);
        return NextResponse.json(
          {
            error: "variation not found ",
          },
          { status: 400 }
        );
      }
      stockCount = foundVariation.stock;
    } else if (variationType === "NONE") {
      stockCount = existingProduct.stock;
    }

    return NextResponse.json({ stockCount, maxPurchase, isArchived }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stock count:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
