import { like, or } from "drizzle-orm";
import { db } from "../..";
import { variations as variationsTable } from "@/lib/db/schema/variations";
import { nestedVariations as nestedVariationsTable } from "@/lib/db/schema/nestedVariations";
import { categories as categoriesTable } from "@/lib/db/schema/categories";
import { unstable_cache } from "next/cache";

export const getDistinctColors = async () => {
  try {
    const colorVariations = await db
      .selectDistinct({ name: variationsTable.name })
      .from(variationsTable)
      .where(
        or(
          like(variationsTable.label, "%color%"),
          like(variationsTable.label, "%colors%"),
          like(variationsTable.label, "%colours%"),
          like(variationsTable.label, "%colour%")
        )
      );

    const colorNestedVariations = await db
      .selectDistinct({ name: nestedVariationsTable.name })
      .from(nestedVariationsTable)
      .where(
        or(
          like(nestedVariationsTable.label, "%color%"),
          like(nestedVariationsTable.label, "%colors%"),
          like(nestedVariationsTable.label, "%colours%"),
          like(nestedVariationsTable.label, "%colour%")
        )
      );

    return { colorVariations, colorNestedVariations };
  } catch (error) {
    throw new Error("Failed fetch distinct colors");
  }
};

export const getDistinctSizes = async () => {
  try {
    const sizeVariations = await db
      .selectDistinct({ name: variationsTable.name })
      .from(variationsTable)
      .where(or(like(variationsTable.label, "%size%"), like(variationsTable.label, "%sizes%")));

    const sizeNestedVariations = await db
      .selectDistinct({ name: nestedVariationsTable.name })
      .from(nestedVariationsTable)
      .where(or(like(nestedVariationsTable.label, "%size%"), like(nestedVariationsTable.label, "%sizes%")));
    return { sizeVariations, sizeNestedVariations };
  } catch (error) {
    throw new Error("Failed fetch distinct sizes");
  }
};

export const getDistinctCategories = unstable_cache(
  async () => {
    try {
      return await db.selectDistinct({ name: categoriesTable.name }).from(categoriesTable);
    } catch (error) {
      throw new Error("Failed fetch distinct categories");
    }
  },
  ["categories"],
  { tags: ["categories"] }
);
