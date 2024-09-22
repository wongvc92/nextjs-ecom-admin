import { variations as variationsTable } from "@/lib/db/schema/variations";
import { convertTwoDecimalNumberToCents } from "../utils";
import { galleries as galleriesTable } from "@/lib/db/schema/galleries";
import { eq } from "drizzle-orm";
import { TVariationsSchema } from "../validation/variationValidation";

export const createNewVariation = async (variation: TVariationsSchema, productId: string, tx: any) => {
  try {
    const insertedVariations = await tx
      .insert(variationsTable)
      .values({
        ...variation,
        productId,
        priceInCents: variation.price ? convertTwoDecimalNumberToCents(variation.price) : 0,
      })
      .returning({ id: variationsTable.id, image: variationsTable.image });
    return insertedVariations;
  } catch (error) {
    throw new Error("Failed create new variation");
  }
};

export const updateExistingVariation = async (
  previousVariation: TVariationsSchema,
  productId: string,
  tx: any
): Promise<{ id: string; image: string }[]> => {
  try {
    const insertedVariations = await tx
      .update(variationsTable)
      .set({
        ...previousVariation,
        productId,
        priceInCents: previousVariation.price ? convertTwoDecimalNumberToCents(previousVariation.price) : 0,
      })
      .where(eq(variationsTable.id, previousVariation.id as string))
      .returning({ id: variationsTable.id, image: variationsTable.image });
    return insertedVariations;
  } catch (error) {
    throw new Error("Failed update variation");
  }
};

export const updateGalleryImagePublishedStatusByVariationId = async (url: string, variationId: string, tx: any) => {
  try {
    const [matchedUrl] = await tx.select({ id: galleriesTable.id, url: galleriesTable.url }).from(galleriesTable).where(eq(galleriesTable.url, url));
    if (matchedUrl) {
      await tx
        .update(galleriesTable)
        .set({
          published: true,
          variationId: variationId,
        })
        .where(eq(galleriesTable.id, matchedUrl.id));
    }
  } catch (error) {
    return null;
  }
};

export const deleteVariationImageByUrl = async (url: string, tx: any) => {
  try {
    await tx.delete(variationsTable).where(eq(variationsTable.image, url));
  } catch (error) {
    throw new Error("Failed update gallery status");
  }
};
