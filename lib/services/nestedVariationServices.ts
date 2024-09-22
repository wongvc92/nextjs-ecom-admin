import { eq } from "drizzle-orm";

import { nestedVariations as nestedVariationsTable } from "@/lib/db/schema/nestedVariations";
import { convertTwoDecimalNumberToCents } from "@/lib/utils";
import { TNestedVariationsSchema } from "../validation/nestedVariationValidation";

export const createNewNestedVariation = async (nestedVariation: TNestedVariationsSchema, variationId: string, tx: any): Promise<{ id: string }> => {
  try {
    const insertedVariations = await tx
      .insert(nestedVariationsTable)
      .values({
        ...nestedVariation,
        variationId,
        priceInCents: nestedVariation.price ? convertTwoDecimalNumberToCents(nestedVariation.price) : 0,
      })
      .returning({ id: nestedVariationsTable.id });
    return insertedVariations;
  } catch (error) {
    throw new Error("Failed create new nested variation");
  }
};

export const updateExistingNestedVariation = async (previousNestedVariation: TNestedVariationsSchema, variationId: string, tx: any) => {
  try {
    await tx
      .update(nestedVariationsTable)
      .set({
        ...previousNestedVariation,
        priceInCents: previousNestedVariation.price ? convertTwoDecimalNumberToCents(previousNestedVariation.price) : 0,
      })
      .where(eq(nestedVariationsTable.id, previousNestedVariation.id as string));
  } catch (error) {
    throw new Error("Failed update nested variation");
  }
};
