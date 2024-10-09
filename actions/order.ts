"use server";

import { updateOrderStatus, updateTrackingNumber } from "@/lib/services/orderServices";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { trackingNumberSchema, TtrackingNumberSchema } from "@/lib/validation/trackingNumberValidation";
import { revalidatePath } from "next/cache";
import { revalidateTagStore } from "@/lib/services/storeServices";
import { createOrderStatusHistory } from "@/lib/services/orderHistoryStatusServices";
import { updateOrderStatusSchema } from "@/lib/validation/orderValidation";

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
    await createOrderStatusHistory("shipped", orderId);
    revalidatePath(`/orders/${orderId}`);
    await revalidateTagStore([`/orders/${orderId}`]);
    return { success: "tracking number updated" };
  } catch (error) {
    return {
      error: "Failed update tracking number",
    };
  }
};

export const updateOrderStatusByOrderId = async (formData: FormData) => {
  const parsed = updateOrderStatusSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { id, status } = parsed.data;

  try {
    await updateOrderStatus(status, id);
    await createOrderStatusHistory(status, id);

    return {
      success: "order status updated",
    };
  } catch (error) {
    console.log("Failed update order status: ", error);
    return { error: "Failed update order status" };
  }
};
