export interface ICategory {
  id: string;
  name: string;
}

export interface ISize {
  id: string;
  name: string;
}

export interface IColor {
  id: string;
  name: string;
}

export interface ClerkCustomerInfo {
  clerkId: string;
  email: string;
  fullName: string;
}

export interface IProductImage {
  id: string;
  url: string;
  productId: string | null;
}

export interface INestedVariation {
  id: string | null;
  label: string | null;
  name: string | null;
  priceInCents: string | null; // Convert Decimal to string
  stock: string | null;
  sku: string | null;
}

export interface IVariation {
  id: string | null;
  label: string | null;
  name: string | null;
  priceInCents: string | null; // Convert Decimal to string
  stock: string | null;
  sku: string | null;
  image: string | null;
  nestedVariations: INestedVariation[];
}

export interface IProduct {
  id: string;
  productImages: IProductImage[];
  availableVariations: string[];
  name: string;
  category: string;
  description: string;
  priceInCents: number;
  stock: number;
  minPurchase: number;
  maxPurchase: number;
  weight: number;
  shippingFeeInCents: number;
  variation: IVariation[];
}

export interface CartItem {
  id: string;
  productId: string;
  variationId: string | null;
  quantity: number;
  variationType: string;
  nestedVariationId?: string | null;
  product?: IProduct | null;
}

export interface IFavourite {
  id: string;
  clerkId: string;
  productId: string;
  variationType: string;
  selectedVariationId: string | null;
  selectedVariationLabel: string | null;
  selectedVariationName: string | null;
  selectedNestedVariationId: string | null;
  selectedNestedVariationLabel: string | null;
  selectedNestedVariationName: string | null;
}

export interface Order {
  id: string;
  clerkId?: string | null;
  amountInCents: string; // Decimal in Prisma, number in TypeScript
  status: string;
  guestEmail?: string | null;
  createdAt: string;
  shippings: Shipping[];
  orderItems: OrderItem[];
}

export interface Shipping {
  id: string;
  address: string;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  name: string;
  phone?: string | null;
  email: string;
}

export interface OrderItem {
  // Define the properties of OrderItem based on your actual schema for OrderItem
  id: string | null;
  productName: string;
  quantity: string;
  priceInCents: string;
  category: string;
  variationLabel?: string | null;
  variationName?: string | null;
  nestedVariationLabel?: string | null;
  nestedVariationName?: string | null;
  image?: string | null;
}

export interface IGallery {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  url: string;
  productId: string | null;
  variationId: string | null;
  bannerImageId: string | null;
  published: boolean | null;
}

export interface OrderStats {
  allOrdersCount: number;
  cancelledOrdersCount: number;
  toShipOrdersCount: number;
  pendingOrdersCount: number;
  shippedOrdersCount: number;
  completedOrdersCount: number;
}
