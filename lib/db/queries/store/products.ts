import { and, asc, between, count, desc, eq, ilike } from "drizzle-orm";
import { Product, products as productsTable } from "@/lib/db/schema/products";
import { db } from "@/lib/db/index";
import { IProductsQuery } from "@/lib/validation/productValidation";
import { buildQueryArrayCondition } from "@/lib/services/queryServices";

export const getProductsId = async (): Promise<{ id: string }[] | []> => {
  let productsId = await db.select({ id: productsTable.id }).from(productsTable);
  if (!productsId) return [];
  console.log(productsId);
  return productsId;
};
export const getProducts = async (validatedParams: IProductsQuery) => {
  const { category, color, maxPrice, minPrice, page, query, size, sort, tags } = validatedParams;

  const PRODUCT_PER_PAGE = 6;
  const productConditions = [eq(productsTable.isArchived, false), between(productsTable.lowestPriceInCents, 0, 1000000)];

  let orderBy;
  if (sort === "price-desc") {
    orderBy = desc(productsTable.lowestPriceInCents);
  } else if (sort === "price-asc") {
    orderBy = asc(productsTable.lowestPriceInCents);
  } else if (sort === "latest-desc") {
    orderBy = desc(productsTable.createdAt);
  } else {
    orderBy = undefined;
  }

  if (query !== "") {
    productConditions.push(ilike(productsTable.name, `%${query}%`));
  }
  if (category !== "") {
    productConditions.push(ilike(productsTable.category, `%${category}%`));
  }

  if (minPrice && maxPrice) {
    between(productsTable.lowestPriceInCents, parseInt(minPrice) * 100, parseInt(maxPrice) * 100);
  }

  const variationsCondition = buildQueryArrayCondition(productsTable.availableVariations, [...color, ...size]);
  const tagsCodition = buildQueryArrayCondition(productsTable.tags, tags);

  const conditions = [...productConditions, variationsCondition, tagsCodition].filter(Boolean);

  try {
    const productsData = await db.query.products.findMany({
      where: and(...conditions),
      with: {
        variations: {
          with: {
            nestedVariations: true,
          },
        },
        productImages: true,
      },
      orderBy: orderBy,
      limit: PRODUCT_PER_PAGE,
      offset: (parseInt(page) - 1) * PRODUCT_PER_PAGE,
    });

    const [productCounts] = await db
      .select({ count: count() })
      .from(productsTable)
      .where(and(...conditions));
    return { products: productsData, productCounts: productCounts.count, perPage: PRODUCT_PER_PAGE };
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const getProductById = async (productId: string): Promise<Product | undefined> => {
  try {
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
    return product;
  } catch (error) {
    throw new Error("Failed fetch product");
  }
};

export const getFeaturedProducts = async () => {
  try {
    const featuredProducts = await db.query.products.findMany({
      where: eq(productsTable.isFeatured, true),
      with: {
        variations: {
          with: {
            nestedVariations: true,
          },
        },
        productImages: true,
      },
      limit: 6,
    });
    return featuredProducts;
  } catch (error) {
    return null;
  }
};
