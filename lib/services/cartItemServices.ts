import { getProductById } from "@/lib/db/queries/admin/products";
import { CartItem } from "@/lib/types";
import { findSelectedNestedVariation, findSelectedVariation } from "../helpers/productHelpers";

export interface ICheckoutCartItem extends CartItem {
  checkoutPriceInCents: number;
  checkoutNestedVariationName?: string;
  checkoutNestedVariationLabel?: string;
  checkoutVariationName?: string;
  checkoutVariationLabel?: string;
  checkoutImage: string;
}

export const recheckCartItems = async (cartItems: CartItem[]): Promise<ICheckoutCartItem[] | null> => {
  let checkoutCartItems: ICheckoutCartItem[] = [];
  for (const item of cartItems as CartItem[]) {
    const product = await getProductById(item.productId);

    if (!product) {
      return null;
    }

    if (item.variationType === "NESTED_VARIATION") {
      const foundVariation = findSelectedVariation(item.variationId as string, product);

      if (!foundVariation) {
        return null;
      }

      const foundNestedVariation = findSelectedNestedVariation(item.variationId as string, item.nestedVariationId as string, product);

      if (!foundNestedVariation) {
        return null;
      }
      const cartItemData = {
        ...item,
        checkoutVariationName: foundVariation.name ?? "",
        checkoutVariationLabel: foundVariation.label ?? "",
        checkoutNestedVariationName: foundNestedVariation.name ?? "",
        checkoutNestedVariationLabel: foundNestedVariation.label ?? "",
        checkoutPriceInCents: foundNestedVariation.priceInCents as number,
        checkoutImage: foundVariation.image as string,
      };
      checkoutCartItems.push(cartItemData);
    } else if (item.variationType === "VARIATION") {
      const foundVariation = findSelectedVariation(item.variationId as string, product);

      if (!foundVariation) {
        console.error(`Product with ID ${item.productId} not found`);
        return null;
      }

      const cartItemData = {
        ...item,
        checkoutVariationName: foundVariation.name ?? "",
        checkoutVariationLabel: foundVariation.label ?? "",
        checkoutNestedVariationName: "",
        checkoutNestedVariationLabel: "",
        checkoutPriceInCents: foundVariation.priceInCents as number,
        checkoutImage: foundVariation.image as string,
      };
      checkoutCartItems.push(cartItemData);
    } else if (item.variationType === "NONE") {
      const cartItemData = {
        ...item,
        checkoutVariationName: "",
        checkoutVariationLabel: "",
        checkoutNestedVariationName: "",
        checkoutNestedVariationLabel: "",
        checkoutPriceInCents: product.priceInCents as number,
        checkoutImage: product.productImages[0].url as string,
      };
      checkoutCartItems.push(cartItemData);
    }
  }
  return checkoutCartItems;
};
