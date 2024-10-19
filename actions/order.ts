"use server";

import { deleteOrderDB, updateOrderStatus } from "@/lib/services/orderServices";
import { revalidatePath, revalidateTag } from "next/cache";
import { createOrderStatusHistory } from "@/lib/services/orderHistoryStatusServices";
import { updateOrderStatusSchema } from "@/lib/validation/orderValidation";
import { orders as ordersTable, OrderStatusEnumType } from "@/lib/db/schema/orders";
import { validate as isUuid } from "uuid";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";

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

export const deleteMultipleOrders = async (ids: string[]) => {
  console.log("ids length", ids.length);
  if (!ids.length) {
    return {
      error: "ids is needed",
    };
  }

  if (ids.some((id) => !isUuid(id))) {
    return {
      error: "incorrect id format",
    };
  }

  try {
    const orderData = await Promise.all(
      ids.map(async (id) => {
        const [data] = await db
          .select()
          .from(ordersTable)
          .where(and(eq(ordersTable.id, id), eq(ordersTable.status, "pending")));
        return data;
      })
    );

    // Calculate the time that is 5 minutes ago
    // const OneMinutesAgo = new Date();
    // OneMinutesAgo.setMinutes(OneMinutesAgo.getMinutes() - 1);

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const validOrderIds = orderData
      .filter((order) => order && order.createdAt) // Ensure order and createdAt exist
      .filter((order) => new Date(order.createdAt as Date) < twentyFourHoursAgo) // Compare createdAt
      .map((order) => order.id);

    if (validOrderIds.length === 0) {
      return {
        error: "Only pending orders created more than 24 hours ago can be deleted",
      };
    }

    await Promise.all(
      validOrderIds.map(async (id) => {
        await deleteOrderDB(id);
      })
    );
    revalidatePath("/orders");
    revalidateTag("orders");
    return {
      success: "Selected orders deleted successfully",
    };
  } catch (error) {
    console.log("Failed delete selected orders", error);
    return {
      error: "Failed delete selected orders",
    };
  }
};

export const deleteOrder = async (id: string) => {
  if (!id) {
    return {
      error: "id is needed",
    };
  }

  try {
    const [orderData] = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.id, id), eq(ordersTable.status, "pending")));

    if (!orderData) {
      return {
        error: "Only pending orders created more than 24 hours ago can be deleted",
      };
    }

    // Calculate the time that is 5 minutes ago
    // const OneMinutesAgo = new Date();
    // OneMinutesAgo.setMinutes(OneMinutesAgo.getMinutes() - 1);

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const isLessThan24Hour = orderData.createdAt && new Date(orderData.createdAt as Date) < twentyFourHoursAgo; // Compare createdAt
    if (isLessThan24Hour) {
      return {
        error: "Only pending orders created more than 24 hours ago can be deleted",
      };
    }

    await deleteOrderDB(id);

    revalidatePath("/orders");
    revalidateTag("orders");
    return {
      success: "Selected orders deleted successfully",
    };
  } catch (error) {
    console.log("Failed delete selected orders", error);
    return {
      error: "Failed delete selected orders",
    };
  }
};
