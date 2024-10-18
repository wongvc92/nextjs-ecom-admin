"use server";
import { db } from "@/lib/db";
import { senders as sendersTable } from "@/lib/db/schema/senders";
import { senderFormSchema, TSenderFormSchema } from "@/lib/validation/courierValidation";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { validate as isUuid } from "uuid";

export const createSender = async (values: TSenderFormSchema): Promise<{ error?: string; success?: string }> => {
  const parsed = senderFormSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    console.error("errorMessage", errorMessage);
    return { error: errorMessage };
  }

  try {
    await db.insert(sendersTable).values({ ...parsed.data });
    const existingSenders = await db.select({ id: sendersTable.id }).from(sendersTable);

    if (existingSenders.length === 1) {
      await db.update(sendersTable).set({ defaultSender: true }).where(eq(sendersTable.id, existingSenders[0].id));
    }
    return {
      success: "Sender info created",
    };
  } catch (error) {
    console.log("Failed create sender info :", error);
    return {
      error: "Failed create sender info",
    };
  } finally {
    revalidatePath("/shippings");
    revalidateTag("senders");
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
  } finally {
    revalidatePath("/shippings");
    revalidateTag("senders");
  }
};

export const deleteSender = async (id: string): Promise<{ error?: string; success?: string }> => {
  if (!id || !isUuid(id)) {
    return {
      error: "id is required",
    };
  }
  try {
    const [currentDefaultSender] = await db.select({ defaultSender: sendersTable.defaultSender }).from(sendersTable).where(eq(sendersTable.id, id));

    if (currentDefaultSender.defaultSender === true) {
      return {
        error: "Please set a new default sender info before delete",
      };
    }

    await db.delete(sendersTable).where(eq(sendersTable.id, id));
    return {
      success: "Sender info deleted",
    };
  } catch (error) {
    console.log("Failed delete sender info :", error);
    return {
      error: "Failed delete sender info",
    };
  } finally {
    revalidatePath("/shippings");
    revalidateTag("senders");
  }
};

export const setDefaultSender = async (id: string): Promise<{ error?: string; success?: string }> => {
  if (!id || !isUuid(id)) {
    return {
      error: "id is required",
    };
  }
  try {
    const [currentIdIsDefault] = await db.select({ defaultSender: sendersTable.defaultSender }).from(sendersTable).where(eq(sendersTable.id, id));

    if (currentIdIsDefault.defaultSender === true) {
      return {
        error: "Current address is default sender",
      };
    }

    const [previousDefaultSender] = await db.select({ id: sendersTable.id }).from(sendersTable).where(eq(sendersTable.defaultSender, true));

    await db.update(sendersTable).set({ defaultSender: false }).where(eq(sendersTable.id, previousDefaultSender.id));
    await db.update(sendersTable).set({ defaultSender: true }).where(eq(sendersTable.id, id));

    return {
      success: "Succesfully set default sender info",
    };
  } catch (error) {
    console.log("Failed set default sender info: ", error);
    return {
      error: "Failed set default sender info",
    };
  } finally {
    revalidatePath("/shippings");
    revalidateTag("senders");
  }
};
