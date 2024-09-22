import { Product } from "../db/schema/products";

export const findOrderItemdProductImage = (variationId: string, product: Product): string | null => {
  if (!product) return null;
  let image = null;
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    image = product.variations?.find((v) => v.id === variationId)?.image || "";
  } else if (product.variationType === "NONE") {
    image = product.productImages[0].url;
  }
  return image;
};

export const findOrderItemSubTotal = (quantity: number, Price: number): number => {
  if (!quantity || !Price) return 0;
  return quantity * Price;
};

export const findOrderItemdVariationName = (variationId: string, product: Product): string | null => {
  if (!product || !variationId) return null;
  let variationName = null;
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    variationName = product.variations?.find((v) => v.id === variationId)?.name as string;
  } else {
    variationName = null;
  }
  return variationName;
};

export const findOrderItemdVariationLabel = (variationId: string, product: Product): string | null => {
  if (!product || !variationId) return null;
  let variationLabel = null;
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    variationLabel = product.variations?.find((v) => v.id === variationId)?.label as string;
  } else {
    variationLabel = null;
  }
  return variationLabel;
};

export const findOrderItemdNestedVariationName = (variationId: string, nestedVariationId: string, product: Product): string | null => {
  if (!product || !variationId || !nestedVariationId) return null;
  let nestedVariationName = null;
  if (product.variationType === "NESTED_VARIATION") {
    nestedVariationName = product.variations?.find((v) => v.id === variationId)?.nestedVariations?.find((nv) => nv.id === nestedVariationId)
      ?.name as string;
  } else {
    nestedVariationName = null;
  }
  return nestedVariationName;
};

export const findOrderItemdNestedVariationLabel = (variationId: string, nestedVariationId: string, product: Product): string | null => {
  if (!product || !variationId || !nestedVariationId) return null;
  let nestedVariationLabel = null;
  if (product.variationType === "NESTED_VARIATION") {
    nestedVariationLabel = product.variations?.find((v) => v.id === variationId)?.nestedVariations?.find((nv) => nv.id === nestedVariationId)
      ?.label as string;
  } else {
    nestedVariationLabel = null;
  }
  return nestedVariationLabel;
};
