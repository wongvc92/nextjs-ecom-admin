"use server";

import { getOrderById } from "@/lib/db/queries/admin/orders";
import { getProductById } from "@/lib/db/queries/admin/products";
import { getDefaultSender } from "@/lib/db/queries/admin/senders";
import { getShippingAddressByOrderId } from "@/lib/db/queries/admin/shippings";
import { Product } from "@/lib/db/schema/products";
import { Payment } from "@/lib/db/types/couriers/paymentResponse";
import { Address, OrderInfo, OrderItem, ShipmentRequest } from "@/lib/db/types/couriers/shipmentRequest";
import { ShipmentResponse } from "@/lib/db/types/couriers/shipmentResponse";
import { createOrderStatusHistory } from "@/lib/services/orderHistoryStatusServices";
import { updateOrderStatus, updateShippingOrderNumber, updateTrackingNumberByOrderId } from "@/lib/services/orderServices";
import { calculateTotalDimensions } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";

const TRACKING_MY_BASE_URL = process.env.NEXT_PUBLIC_TRACKING_MY_URL!;
const TRACKING_MY_API_KEY = process.env.TRACKING_MY_API_KEY!;
const webhookBaseUrl = process.env.NEXT_PUBLIC_APP_URL!;
const webhookSecretKey = process.env.TRACKING_MY_WEBHOOK_SECRET_KEY!;

export const updateCourierWebhook = async (eventOptions: string[]) => {
  if (!TRACKING_MY_BASE_URL) {
    console.log("Please provide TRACKING_MY_BASE_URL in env file");
    return { error: "Failed update event options " };
  }
  if (!TRACKING_MY_API_KEY) {
    console.log("Please provide TRACKING_MY_API_KEY in env file");
    return { error: "Failed update event options " };
  }
  if (!webhookBaseUrl) {
    console.log("Please provide webhook Base Url in env file");
    return { error: "Failed update event options " };
  }
  if (!webhookSecretKey) {
    console.log("Please provide webhook Secret Key in env file");
    return { error: "Failed update event options " };
  }

  const trackingURL = new URL(`${TRACKING_MY_BASE_URL}/api/v1/webhook`);
  const url = new URL(`${webhookBaseUrl}/api/webhook/courier?secret=${webhookSecretKey}`);
  try {
    const res = await fetch(trackingURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Tracking-Api-Key": TRACKING_MY_API_KEY,
      },
      body: JSON.stringify({ url, events: eventOptions }),
    });
    if (!res.ok) {
      const errorResponse = await res.json();
      console.log("Failed update webhook info: ", `${res.status} - ${res.statusText}`, errorResponse);
      return { error: "Failed update event options " };
    }

    return {
      success: "Successfully update event options",
    };
  } catch (error) {
    console.error("Failed update event options", error);
    return {
      error: "Failed update event options",
    };
  } finally {
    revalidatePath("/shippings/webhook");
    revalidateTag("courier_webhook");
  }
};

export const createShipment = async (orderId: string, service_id: number): Promise<{ success?: string; error?: string }> => {
  if (!orderId || !service_id) {
    return { error: "Please provide orderId or service_id" };
  }

  if (!TRACKING_MY_BASE_URL) {
    console.log("Please provide TRACKING_MY_BASE_URL in env file");
    return { error: "Failed create shipment" };
  }

  const url = new URL(`${TRACKING_MY_BASE_URL}/api/v1/shipments`);

  const orderData = await getOrderById(orderId);
  if (!orderData) {
    return { error: "order does not exist" };
  }
  const orderShippingData = await getShippingAddressByOrderId(orderId);
  const productData = await getProductById(orderData.orderItems[0].productId);

  const defaultSender = await getDefaultSender();

  if (!defaultSender) {
    return { error: "Please provide default sender info" };
  }

  let products: Product[] = [];
  for (const orderItem of orderData.orderItems) {
    const product = await getProductById(orderItem.productId);
    if (product) {
      products.push(product);
    }
  }

  const { totalHeight, totalLength, totalWidth } = calculateTotalDimensions(products);
  const sender: Address = {
    name: defaultSender.name,
    dialing_country_code: defaultSender.dialing_country_code as "MY" | "SG" | "TH",
    phone: parseInt(defaultSender.phone as string),
    email: defaultSender.email || "",
    address_1: defaultSender.address_1,
    address_2: defaultSender.address_2 || "",
    postcode: parseInt(defaultSender.postcode as string),
    province: defaultSender.province,
    city: defaultSender.city,
    country: defaultSender.country as "MY" | "SG" | "TH",
  };

  const receiver: Address = {
    name: orderShippingData?.name || "",
    dialing_country_code: "MY",
    phone: parseInt(orderShippingData?.phone as string),
    email: orderShippingData?.email || "",
    address_1: orderShippingData?.address || "",
    address_2: orderShippingData?.address2 || "",
    postcode: parseInt(orderShippingData?.postalCode as string),
    province: orderShippingData?.state || "",
    city: orderShippingData?.city || "",
    country: "MY",
  };

  const orderItems: OrderItem[] = orderData.orderItems.map((item) => {
    return {
      source_id: orderData.id,
      title: item.productName,
      product_id: item.productId,
      variant_id: item.variationId || "",
      image_urls: item.image ? [item.image] : [],
      quantity: item.quantity,
      unit_price: item.priceInCents / 100,
    };
  });

  const order: OrderInfo = {
    source_id: orderData.id,
    number: orderData.id,
    fulfillment_status: "fulfilled",
    payment_status: "paid",
    currency: "MYR",
    subtotal: orderData.subtotalInCents / 100,
    total_shipping: orderData.totalShippingInCents / 100,
    total_price: orderData.amountInCents / 100,
    ordered_at: orderData.createdAt?.toISOString().split(".")[0] + "Z",
    items: [...orderItems],
  };

  const shipping: ShipmentRequest = {
    service_id,
    type: "normal",
    length: totalLength,
    height: totalHeight,
    width: totalWidth,
    // whatsapp_messages: ["out_for_delivery"],
    // whatsapp_messages: null,
    // language: "en",
    parcel_content: productData?.category || "",
    parcel_value: orderData.subtotalInCents / 100,
    weight: orderData.totalWeightInGram / 1000,
    sender,
    receiver,
    order,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Tracking-Api-Key": TRACKING_MY_API_KEY,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipping),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.log("Failed create shipment: ", `${res.status} - ${res.statusText}`, errorResponse);
      return { error: "Failed create shipment" };
    }
    const data = await res.json();
    const shipment: ShipmentResponse = data.shipment;

    await updateShippingOrderNumber(shipment.order_number, orderId);
    const paymentRes = await makePayment(shipment.order_number, orderData.id);
    if (paymentRes?.error) {
      return {
        error: paymentRes.error,
      };
    }
    revalidatePath(`/orders/${orderId}`);
    revalidateTag("orders");
    return {
      success: "Succesfully create shipment",
    };
  } catch (error) {
    console.log("Failed create shipment: ", error);
    return {
      error: "Failed create shipment",
    };
  }
};

export const makePayment = async (
  order_number: string,
  orderId: string
): Promise<{
  error: string;
} | null> => {
  const url = new URL(`${TRACKING_MY_BASE_URL}/api/v1/shipments/payments`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Tracking-Api-Key": TRACKING_MY_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ order_numbers: [order_number] }),
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.log("Failed make payment: ", `${res.status} - ${res.statusText}`, errorResponse);
      return { error: "Failed make payment" };
    }

    const data: Payment = await res.json();
    await updateTrackingNumberByOrderId(data.shipments[0].tracking.tracking_number, orderId);
    await createOrderStatusHistory("shipped", orderId);
    await updateOrderStatus("shipped", orderId);
    return null;
  } catch (error) {
    console.log("Failed make payment: ", error);
    return {
      error: "Failed make payment",
    };
  }
};
