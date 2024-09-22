import { eq } from "drizzle-orm";
import { db } from "../db";
import { categories as categoriesTable } from "@/lib/db/schema/categories";

export const createCategoryDB = async (name: string) => {
  try {
    const [category] = await db.insert(categoriesTable).values({ name }).returning({ name: categoriesTable.name });
    return category;
  } catch (error) {
    throw new Error("Failed create category");
  }
};

export const updateCategoryDB = async (name: string, id: string) => {
  try {
    await db.update(categoriesTable).set({ name: name }).where(eq(categoriesTable.id, id));
  } catch (error) {
    throw new Error("Failed edit category");
  }
};

export const deleteCategoryDB = async (id: string) => {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  } catch (error) {
    throw new Error("Failed delete category");
  }
};
