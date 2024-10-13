import { CourierService } from "../types";
import { CourierRequest } from "../validation/courierValidation";

export const courierServices = async ({ toPostcode, totalWeightInKg, courierChoice }: CourierRequest): Promise<CourierService[] | null> => {
  try {
    const res = await fetch("/api/courier/services", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        courier: courierChoice,
        fromPostcode: 51000,
        toPostcode: toPostcode,
        weight: totalWeightInKg,
      }),
    });

    if (!res.ok) {
      return null;
    }

    const data: CourierService[] = await res.json();
    if (!data) return null;

    return data;
  } catch (error) {
    console.error("Failed fetch courier service");
  }
  return null;
};
