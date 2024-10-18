import { ShipmentResponse } from "../../types/couriers/shipmentResponse";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const getShipmentByShippingOrderNumber = async (shippingOrderNumber: string) => {
  const url = new URL(`${baseUrl}/api/couriers/shipments/${shippingOrderNumber}`);
  try {
    const res = await fetch(url, {
      method: "GET",
    });
    if (!res.ok) {
      return null;
    }
    const data: ShipmentResponse = await res.json();

    return data;
  } catch (error) {
    return null;
  }
};

export const getWebhookInfo = async () => {
  const url = new URL(`${baseUrl}/api/couriers/webhook`);
  try {
    const res = await fetch(url, {
      method: "GET",
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();

    return data;
  } catch (error) {
    return null;
  }
};
