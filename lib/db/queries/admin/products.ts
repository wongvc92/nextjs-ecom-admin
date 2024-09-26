import { and, between, count, eq, ilike, inArray } from "drizzle-orm";
import { db } from "../..";
import { Product, products as productsTable } from "../../schema/products";
import { cache } from "react";

export const getProducts = cache(
  async (
    name: string,
    perPage: string,
    page: string,
    dateFrom: string,
    dateTo: string,
    isArchived: string | string[],
    isFeatured: string | string[],
    category: string | string[],
    isOutOfStock: string
  ): Promise<{ products: Product[]; filteredCount: number }> => {
    const whereCondition = [];
    if (name.trim() !== "") {
      whereCondition.push(ilike(productsTable.name, `%${name}%`));
    }
    if (dateFrom && dateTo) {
      whereCondition.push(between(productsTable.createdAt, new Date(dateFrom), new Date(dateTo)));
    }

    if (Array.isArray(isArchived) && isArchived.length > 0) {
      // Convert the array of strings to an array of booleans
      const booleanIsArchived = isArchived.map((value) => value === "TRUE");

      if (booleanIsArchived.length === 1) {
        // If there's only one value in the array, use eq for precise matching
        whereCondition.push(eq(productsTable.isArchived, booleanIsArchived[0]));
      } else {
        // If there are both true and false values, use inArray
        whereCondition.push(inArray(productsTable.isArchived, booleanIsArchived));
      }
    } else if (typeof isArchived === "string" && isArchived !== "") {
      const isArchivedBoolean = isArchived === "TRUE";
      whereCondition.push(eq(productsTable.isArchived, isArchivedBoolean));
    }

    if (Array.isArray(isFeatured) && isFeatured.length > 0) {
      const booleanIsFeatured = isFeatured.map((value) => value === "TRUE");
      whereCondition.push(inArray(productsTable.isFeatured, booleanIsFeatured));
    } else if (typeof isFeatured === "string" && isFeatured !== "") {
      const isFeaturedBoolean = isFeatured === "TRUE";
      whereCondition.push(eq(productsTable.isFeatured, isFeaturedBoolean));
    }

    if (Array.isArray(category) && category.length > 0) {
      whereCondition.push(inArray(productsTable.category, category));
    } else if (typeof category === "string" && category !== "") {
      whereCondition.push(ilike(productsTable.category, category));
    }

    if (isOutOfStock !== "") {
      whereCondition.push(eq(productsTable.isOutOfStock, true));
    }
    try {
      const productsData = await db.query.products.findMany({
        where: whereCondition.length > 0 ? and(...whereCondition) : undefined,
        with: {
          variations: {
            with: {
              nestedVariations: true,
            },
          },
          productImages: true,
        },
        limit: parseInt(perPage),
        offset: (parseInt(page) - 1) * parseInt(perPage),
      });

      const [filteredCount] = await db
        .select({ count: count() })
        .from(productsTable)
        .where(whereCondition.length > 0 ? and(...whereCondition) : undefined);

      return { products: productsData, filteredCount: filteredCount.count };
    } catch (error) {
      throw new Error("Failed to fetch products.");
    }
  }
);

export const getProductById = cache(async (productId: string): Promise<Product | null> => {
  const product = await db.query.products.findFirst({
    where: eq(productsTable.id, productId),
    with: {
      variations: {
        with: {
          nestedVariations: true,
        },
      },
      productImages: true,
    },
  });

  return product || null;
});

export const getProductStatsCount = cache(async () => {
  try {
    const [allProduct] = await db.select({ count: count() }).from(productsTable);
    const [archivedProduct] = await db.select({ count: count() }).from(productsTable).where(eq(productsTable.isArchived, true));
    const [featuredProduct] = await db.select({ count: count() }).from(productsTable).where(eq(productsTable.isFeatured, true));
    const [outOfStockCount] = await db
      .select({ count: count() }) // Select only the count
      .from(productsTable)
      .where(eq(productsTable.isOutOfStock, true));

    return {
      archivedProductCount: archivedProduct.count,
      featuredProductCount: featuredProduct.count,
      allProductCount: allProduct.count,
      outOfStockCount: outOfStockCount.count,
    };
  } catch (error) {
    console.error("Error fetching product stats:", error);
    throw new Error("Failed fetch product stats");
  }
});

export const getProductsWithCategory = cache(async () => {
  const existingProductWithCategory = await db.select({ categoryName: productsTable.category }).from(productsTable);
  return existingProductWithCategory || [];
});
