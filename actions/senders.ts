"use server";
import { db } from "@/lib/db";
import { senders as sendersTable } from "@/lib/db/schema/senders";
import { senderFormSchema, TSenderFormSchema } from "@/lib/validation/courierValidation";
import { eq } from "drizzle-orm";

export const createSender = async (values: TSenderFormSchema): Promise<{ error?: string; success?: string }> => {
  const parsed = senderFormSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    console.error("errorMessage", errorMessage);
    return { error: errorMessage };
  }

  try {
    await db.insert(sendersTable).values({ ...parsed.data });

    return {
      success: "Sender info created",
    };
  } catch (error) {
    console.log("Failed create sender info :", error);
    return {
      error: "Failed create sender info",
    };
  }
};

export const editSender = async (values: TSenderFormSchema): Promise<{ error?: string; success?: string }> => {
  const parsed = senderFormSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    console.error("errorMessage", errorMessage);
    return { error: errorMessage };
  }

  try {
    await db
      .update(sendersTable)
      .set({ ...parsed.data })
      .where(eq(sendersTable.id, parsed.data.id as string));

    return {
      success: "Sender info edited",
    };
  } catch (error) {
    console.log("Failed edit sender info :", error);
    return {
      error: "Failed edit sender info",
    };
  }
};
