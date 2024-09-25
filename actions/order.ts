"use server";

import { updateTrackingNumber } from "@/lib/services/orderServices";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { trackingNumberSchema, TtrackingNumberSchema } from "@/lib/validation/trackingNumberValidation";
import { revalidateTag } from "next/cache";

export const updateTrackingNumberByOrderId = async (formData: TtrackingNumberSchema) => {
  await ensureAuthenticated();
  const parsed = trackingNumberSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { tracking, orderId } = parsed.data;
  try {
    await updateTrackingNumber(tracking, orderId);
    revalidateTag("orders");
    return { success: "tracking number updated" };
  } catch (error) {
    return {
      error: "Failed update tracking number",
    };
  }
};
