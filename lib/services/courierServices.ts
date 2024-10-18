import { CourierService } from "../types";
import { CourierRequest } from "../validation/courierValidation";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const courierServices = async (values: CourierRequest): Promise<CourierService[] | null> => {
  const url = new URL(`${baseUrl}/api/couriers/services`);

  const bodyData: CourierRequest = {
    ...values,
  };
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(bodyData),
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
