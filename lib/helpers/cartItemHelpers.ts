import { ICheckoutCartItem } from "../services/cartItemServices";

export const findCartItemsSubTotal = (checkoutCartItems: ICheckoutCartItem[]) => {
  if (!checkoutCartItems) return 0;
  return checkoutCartItems.reduce((acc, item) => {
    const itemSubTotalPriceInCents = item.checkoutPriceInCents * item.quantity;
    return acc + itemSubTotalPriceInCents;
  }, 0);
};
