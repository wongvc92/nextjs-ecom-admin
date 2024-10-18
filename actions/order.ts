"use server";

import { updateOrderStatus } from "@/lib/services/orderServices";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { trackingNumberSchema, TtrackingNumberSchema } from "@/lib/validation/trackingNumberValidation";
import { revalidatePath, revalidateTag } from "next/cache";
import { createOrderStatusHistory } from "@/lib/services/orderHistoryStatusServices";
import { updateOrderStatusSchema } from "@/lib/validation/orderValidation";
import { OrderStatusEnumType } from "@/lib/db/schema/orders";

export const updateOrderStatusByOrderId = async (formData: FormData) => {
  const parsed = updateOrderStatusSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { id, status } = parsed.data;

  try {
    await updateOrderStatus(status as OrderStatusEnumType, id);
    await createOrderStatusHistory(status as OrderStatusEnumType, id);
    revalidateTag("orders");
    return {
      success: "order status updated",
    };
  } catch (error) {
    console.log("Failed update order status: ", error);
    return { error: "Failed update order status" };
  }
};
