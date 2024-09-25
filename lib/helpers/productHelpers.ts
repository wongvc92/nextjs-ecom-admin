import { NestedVariation } from "../db/schema/nestedVariations";
import { Product } from "../db/schema/products";
import { Variation } from "../db/schema/variations";

export const findSelectedVariation = (variationId: string, product: Product | null): Variation | null => {
  if (!product) return null;
  let foundVariation: Variation | null = null;
  if (product?.variationType === "NESTED_VARIATION" || product?.variationType === "VARIATION") {
    foundVariation = product?.variations?.find((item) => item.id === variationId) ?? null;
  }

  return foundVariation || null;
};

export const findSelectedNestedVariation = (variationId: string, nestedVariationId: string, product: Product | null): NestedVariation | null => {
  if (!product) return null;
  let foundNestedVariation: NestedVariation | null = null;
  if (product.variationType === "NESTED_VARIATION") {
    foundNestedVariation = product.variations?.find((v) => v.id === variationId)?.nestedVariations?.find((nv) => nv.id === nestedVariationId) ?? null;
  }

  return foundNestedVariation || null;
};

/**
 * Extracts distinct names from nested variations within a list of variations
 * and joins them into a single string.
 *
 * @param variations - Array of Variation objects containing nested variations.
 * @returns A string of distinct nested variation names, joined by commas.
 */
export function getDistinctNestedVariationNames(variations: Variation[]): string {
  const distinctNames = new Set<string>();

  for (const variation of variations) {
    if (variation.nestedVariations) {
      for (const nestedVariation of variation.nestedVariations) {
        distinctNames.add(nestedVariation.name ?? "");
      }
    }
  }

  return Array.from(distinctNames).join(", ");
}

export const findSomeProductOutOfStock = (product: Product | undefined): boolean => {
  if (!product || product === undefined) return false;
  if (product.variationType === "NESTED_VARIATION") {
    return product.variations?.some((variation) => variation.nestedVariations?.some((nestedVariation) => nestedVariation.stock === 0)) ?? false;
  } else if (product.variationType === "VARIATION") {
    return product.variations?.some((variation) => variation.stock === 0) ?? false;
  } else {
    return product.stock === 0;
  }
};

export const findSubtotalPricePerProduct = (quantity: number = 0, price: number = 0): number => {
  return quantity * price;
};
