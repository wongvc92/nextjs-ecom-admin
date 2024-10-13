import { CourierService } from "../types";
import { CourierRequest } from "../validation/courierValidation";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const courierServices = async ({ toPostcode, totalWeightInKg, courierChoice }: CourierRequest): Promise<CourierService[] | null> => {
  const url = new URL(`${baseUrl}/api/courier/services`);
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
