import { eq } from "drizzle-orm";
import { db } from "../..";
import { variations as variationsTable } from "@/lib/db/schema/variations";

export const getVariationsByProductId = async (productId: string) => {
  try {
    const variations = await db.select().from(variationsTable).where(eq(variationsTable.productId, productId));
    return variations;
  } catch (error) {
    throw new Error("Failed fetch variations with product id");
  }
};

export const getVariationImageByUrl = async (url: string) => {
  try {
    const [variationImage] = await db.select({ url: variationsTable.image }).from(variationsTable).where(eq(variationsTable.image, url));
    return variationImage;
  } catch (error) {
    throw new Error("Failed fetch variations image");
  }
};
