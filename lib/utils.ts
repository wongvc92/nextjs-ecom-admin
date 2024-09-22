import { ICheckoutCartItem } from "@/app/api/checkout/guest/route";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Variation } from "./db/schema/variations";
import { Product } from "./db/schema/products";
import { NestedVariation } from "./db/schema/nestedVariations";
import { OrderItem } from "./db/schema/orderItems";
import { arrayContains, SQL } from "drizzle-orm";
import { AnyPgColumn, PgColumn } from "drizzle-orm/pg-core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeSentenceFirstChar(sentence: string): string {
  if (!sentence) return "";
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const convertCentsToTwoDecimalString = (priceInCents: number): string => {
  if (!priceInCents) return "0";
  return (priceInCents / 100).toFixed(2);
};

export const currencyFormatter = (priceInCents: number): string => {
  if (!priceInCents) return "0";
  return `RM ${convertCentsToTwoDecimalString(priceInCents)}`;
};

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

export const findCartItemsSubTotal = (checkoutCartItems: ICheckoutCartItem[]) => {
  if (!checkoutCartItems) return 0;
  return checkoutCartItems.reduce((acc, item) => {
    const itemSubTotalPriceInCents = item.checkoutPriceInCents * item.quantity;
    return acc + itemSubTotalPriceInCents;
  }, 0);
};

export const findCartItemsShippingSubTotal = (checkoutCartItems: ICheckoutCartItem[]) => {
  return checkoutCartItems.reduce((acc, item) => {
    const itemTotalPriceInCents = item.checkoutShippingFeeInCents * item.quantity;
    return acc + itemTotalPriceInCents;
  }, 0);
};

export const findOrderItemsSubTotal = (orderItems: OrderItem[]) => {
  if (!orderItems) return 0;
  return orderItems.reduce((acc, item) => {
    const itemSubTotalPriceInCents = item.priceInCents * item.quantity;
    return acc + itemSubTotalPriceInCents;
  }, 0);
};

export const findOrderItemsShippingSubTotal = (orderItems: OrderItem[]) => {
  if (!orderItems) return 0;
  return orderItems.reduce((acc, item) => {
    const itemTotalPriceInCents = item.shippingFeeInCents * item.quantity;
    return acc + itemTotalPriceInCents;
  }, 0);
};

export const convertTwoDecimalNumberToCents = (priceInTwoDecimal: number): number => {
  return priceInTwoDecimal * 100;
};

export const convertCentsToTwoDecimalNumber = (priceInCents: number): number => {
  return priceInCents / 100;
};

export const convertGramToKilogram = (gram: number): number => {
  return gram / 1000;
};

export const convertKilogramToGram = (kilogram: number): number => {
  return kilogram * 1000;
};

export const revalidateStore = async (urlPaths: string[]) => {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_STORE_URL}/api/revalidate?secret=${encodeURIComponent(process.env.NEXT_PUBLIC_REVALIDATE_SECRET!)}${urlPaths
        .map((path) => `&path=${encodeURIComponent(path)}`)
        .join("")}`,
      {
        method: "POST",
      }
    );
    return {
      success: "Store paths revalidate",
    };
  } catch (error) {
    throw new Error("Failed revalidate store paths");
  }
};

export const findSubtotalPricePerProduct = (quantity: number, Price: number): number => {
  if (!quantity || !Price) return 0;
  return quantity * Price;
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

export const buildQueryArrayCondition = (field: AnyPgColumn, values: string[]): SQL | undefined => {
  return values.length > 0
    ? arrayContains(
        field,
        values.map((v) => v.toLocaleLowerCase())
      )
    : undefined;
};
