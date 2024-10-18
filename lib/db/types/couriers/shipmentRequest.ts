export interface ShipmentRequest {
  sender: Address;
  receiver: Address;
  service_id: number;
  type?: "normal" | "cold"; // Optional type with default 'normal'
  battery_type?: "No_Battery" | "Lithium_Ion_Battery" | "Lithium_Battery" | "Alkaline_Battery" | "Other_Battery";
  battery_packing?: "No_Battery" | "Battery_Only" | "Battery_Packed_with_Equipment" | "Battery_Inside_Equipment";
  smses?: SmsNotificationStatus[] | null; // Optional array of status or null to disable SMS
  whatsapp_messages?: WhatsappNotificationStatus[] | null; // Optional array of status or null to disable WhatsApp
  language?: "en" | "ms" | "zh_CN" | "zh_TW"; // Optional language
  cod_amount?: number; // Optional cash on delivery amount
  parcel_content: string; // Required parcel content
  parcel_value: number; // Required parcel value
  length?: number; // Required if width and height exist
  width?: number; // Required if length and height exist
  height?: number; // Required if length and width exist
  weight: number; // Required parcel weight in kg
  pickup_at?: string; // Required if service type is 'pick_up', must be a date
  items?: FulfillmentItem[]; // Optional items array for fulfillment
  order?: OrderInfo; // Optional order information
}

export interface Address {
  name: string;
  dialing_country_code: "MY" | "SG" | "TH";
  phone: number;
  email?: string; // Optional email
  address_1: string;
  address_2?: string; // Optional address line 2
  postcode: number;
  province: string;
  city: string;
  country: "MY" | "SG" | "TH";
}

export type SmsNotificationStatus = "out_for_delivery" | "delivered" | "exception" | "attempt_fail" | "new_tracking" | "available_for_pickup";

export type WhatsappNotificationStatus = "out_for_delivery" | "delivered" | "new_tracking" | "available_for_pickup";

export interface FulfillmentItem {
  source_order_item_id: string; // Required if items exist
  quantity: string; // Required quantity fulfilled in the current shipment
}

export interface OrderInfo {
  source_id: string; // Required if order exists
  number: string; // Required order number
  fulfillment_status?: "fulfilled" | "partially_fulfilled" | "unfulfilled"; // Optional fulfillment status
  payment_status?: "paid" | "partially_paid" | "unpaid"; // Optional payment status
  currency: string; // Required currency (e.g., MYR)
  subtotal?: number; // Optional subtotal of the order
  total_tax?: number; // Optional sum of taxes applied to the order
  total_shipping?: number; // Optional total shipping fee applied to the order
  total_discount?: number; // Optional total discount applied to the order
  total_price?: number; // Optional total price of the order
  ordered_at?: string; // Optional order confirmed date in ISO8601 format
  items?: OrderItem[]; // Optional array of order items
}

export interface OrderItem {
  source_id: string; // Required if order exists
  title: string; // Required product title
  sku?: string; // Optional SKU
  product_id: string; // Required source ID of the product
  variant_id?: string; // Optional variant ID of the product
  image_urls?: string[]; // Optional array of image URLs
  quantity: number; // Required quantity purchased
  unit_price?: number; // Optional price per unit of the product
  tax?: number; // Optional sum of taxes applied to the product
  discount?: number; // Optional total discount applied to the product
}
