import { and, between, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../..";
import { categories as categoriesTable, Category } from "../../schema/categories";
import { cache } from "react";

export const getCategories = cache(
  async (
    name: string,
    perPage: string,
    page: string,
    dateFrom: string,
    dateTo: string
  ): Promise<{ categoriesData: Category[]; categoryCount: number }> => {
    try {
      const whereCondition = [];

      if (name.trim() !== "") {
        whereCondition.push(ilike(categoriesTable.name, `%${name}%`));
      }

      if (dateFrom && dateTo) {
        whereCondition.push(between(categoriesTable.createdAt, new Date(dateFrom), new Date(dateTo)));
      }

      const allCategories = await db
        .select()
        .from(categoriesTable)
        .where(whereCondition.length > 0 ? and(...whereCondition) : undefined)
        .limit(parseInt(perPage))
        .offset((parseInt(page) - 1) * parseInt(perPage));

      const [categoryCount] = await db
        .select({ count: count() })
        .from(categoriesTable)
        .where(whereCondition.length > 0 ? and(...whereCondition) : undefined);

      return { categoriesData: allCategories, categoryCount: categoryCount.count };
    } catch (error) {
      throw new Error("Failed fetch categories");
    }
  }
);

export const getCategoryById = cache(async (categoryId: string): Promise<Category> => {
  try {
    const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, categoryId));

    return category as Category;
  } catch (error) {
    throw new Error("Failed fetch categorys");
  }
});

export const getDistinctCategories = cache(async (): Promise<Category[]> => {
  try {
    const category = await db.selectDistinct().from(categoriesTable);

    return category as Category[];
  } catch (error) {
    throw new Error("Failed fetch categorys");
  }
});
