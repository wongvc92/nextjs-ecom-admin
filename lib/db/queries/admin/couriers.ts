const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const getShipmentByShippingOrderNumber = async (shippingOrderNumber: string) => {
  const url = new URL(`${baseUrl}/api/shipments/${shippingOrderNumber}`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    console.log("getShipmentByShippingOrderNumber: ", data);
    return data;
  } catch (error) {
    return null;
  }
};
