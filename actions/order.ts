"use server";

import { updateTrackingNumber } from "@/lib/services/orderServices";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { trackingNumberSchema, TtrackingNumberSchema } from "@/lib/validation/trackingNumberValidation";
import { revalidatePath } from "next/cache";
import { revalidateStore } from "@/lib/services/storeServices";

const urlPaths = ["/orders"];

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
    revalidatePath(`/orders/${orderId}`);
    await revalidateStore(urlPaths);
    return { success: "tracking number updated" };
  } catch (error) {
    return {
      error: "Failed update tracking number",
    };
  }
};
