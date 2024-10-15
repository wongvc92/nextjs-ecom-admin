import { getOrderById } from "../db/queries/admin/orders";
import { getProductById } from "../db/queries/admin/products";
import { getShippingAddressByOrderId } from "../db/queries/admin/shippings";
import { Address, OrderInfo, OrderItem, ShipmentRequest } from "../db/types/shipmentRequest";
import { CourierService } from "../types";
import { CourierRequest } from "../validation/courierValidation";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const courierServices = async ({ toPostcode, totalWeightInKg, courierChoice }: CourierRequest): Promise<CourierService[] | null> => {
  const url = new URL(`${baseUrl}/api/couriers/services`);
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        courierChoice,
        toPostcode,
        totalWeightInKg,
      }),
    });

    if (!res.ok) {
      return null;
    }

    const data: CourierService[] = await res.json();
    if (!data) return null;

    return data;
  } catch (error) {
    console.error("Failed fetch courier service: ", error);
    return null;
  }
};

export const createShipment = async (orderId: string, service_id: number) => {
  const url = new URL(`${baseUrl}/api/couriers/shipments`);

  const orderData = await getOrderById(orderId);
  const orderShippingData = await getShippingAddressByOrderId(orderId);
  const productData = await getProductById(orderData.orderItems[0].productId);

  const sender = {
    name: "John",
    dialing_country_code: "MY",
    phone: "60123456789",
    email: "example@gmail.com",
    address_1: "123, Jalan Hang Tuah",
    address_2: "Taman Harimau",
    postcode: "50200",
    province: "Kuala Lumpur",
    city: "Kuala Lumpur",
    country: "MY",
  } as Address;

  const receiver = {
    name: orderShippingData?.name,
    dialing_country_code: "MY",
    phone: orderShippingData?.phone,
    email: orderShippingData?.email,
    address_1: orderShippingData?.address,
    address_2: orderShippingData?.address2 || "",
    postcode: orderShippingData?.postalCode,
    province: orderShippingData?.state,
    city: orderShippingData?.city,
    country: "MY",
  } as Address;

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

  const order = {
    source_id: orderData.id,
    number: orderData.id,
    fulfillment_status: "fulfilled",
    payment_status: "paid",
    currency: "MYR",
    subtotal: orderData.subtotalInCents / 100,
    total_shipping: orderData.totalShippingInCents / 100,
    total_price: orderData.amountInCents / 100,
    ordered_at: orderData.createdAt?.toISOString(),
    orderItem: [...orderItems],
  } as OrderInfo;

  const shipping: ShipmentRequest = {
    service_id,
    type: "normal",
    smses: null,
    whatsapp_messages: null,
    language: "en",
    parcel_content: productData?.category || "",
    parcel_value: orderData.amountInCents / 100,
    weight: orderData.totalWeightInGram / 1000,
    sender,
    receiver,
    order,
  };

  console.log("shipping", shipping);
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ shipping }),
    });

    if (!res.ok) {
      console.log("res.statusText", res.statusText);
      return null;
    }
    const data = await res.json();
    console.log("shipment created res", data);
    return data;
  } catch (error) {
    return null;
  }
};

export const payShipment = async (order_numbers: string[]) => {
  const url = new URL(`${baseUrl}/api/shipments/payments`);
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ order_numbers }),
    });

    if (!res.ok) {
      console.log("Failed make shipment payment: ", `${res.status} - ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    console.log(data);
  } catch (error) {
    return null;
  }
};
