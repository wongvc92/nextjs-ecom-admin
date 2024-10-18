import { Product, products as productsTable } from "@/lib/db/schema/products";
import { convertKilogramToGram, convertTwoDecimalNumberToCents } from "../utils";
import { productImages as productImagesTable } from "@/lib/db/schema/productImages";
import { galleries as galleriesTable } from "@/lib/db/schema/galleries";
import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { TProductSchema } from "../validation/productValidation";
import { OrderItem } from "../db/schema/orderItems";
import { nestedVariations as nestedVariationsTable } from "@/lib/db/schema/nestedVariations";
import { variations as variationsTable } from "@/lib/db/schema/variations";
import { findSomeProductOutOfStock } from "../helpers/productHelpers";
import { revalidatePath } from "next/cache";


export const createNewProduct = async (productData: TProductSchema, tx: any): Promise<{ id: string }> => {
  try {
    const [createdProduct] = await tx
      .insert(productsTable)
      .values({
        ...productData,
        tags: productData?.tags && productData.tags.length > 0 ? productData.tags : [],
        priceInCents: productData.price ? convertTwoDecimalNumberToCents(productData.price) : 0,
        weightInGram: convertKilogramToGram(productData.weight),
        lowestPriceInCents: convertTwoDecimalNumberToCents(productData.lowestPrice),
      })
      .returning({ id: productsTable.id });

    return createdProduct;
  } catch (error) {
    throw new Error("Failed create new product");
  }
};

export const updateExistingProduct = async (productData: TProductSchema, tx: any): Promise<{ id: string }> => {
  try {
    const [updatedProduct] = await tx
      .update(productsTable)
      .set({
        ...productData,
        tags: !!productData?.tags && productData?.tags?.length > 0 ? productData.tags : null,
        priceInCents: productData.price ? convertTwoDecimalNumberToCents(productData.price) : 0,
        weightInGram: convertKilogramToGram(productData.weight),
        lowestPriceInCents: convertTwoDecimalNumberToCents(productData.lowestPrice),
      })
      .where(eq(productsTable.id, productData.id!))
      .returning({ id: productsTable.id });
    return updatedProduct;
  } catch (error) {
    throw new Error("Failed update gallery status");
  }
};

export const deleteProductFromDB = async (productId: string) => {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, productId));
  } catch (error) {
    throw new Error("Failed delete product");
  }
};

export const createNewProductImage = async (url: string, productId: string, tx: any) => {
  try {
    await tx.insert(productImagesTable).values({ url, productId });
  } catch (error) {
    throw new Error("Failed update gallery status");
  }
};

export const updateGalleryImagePublishedStatusByProductId = async (url: string, productId: string, tx: any) => {
  try {
    const [matchedUrl] = await tx.select({ id: galleriesTable.id }).from(galleriesTable).where(eq(galleriesTable.url, url));

    if (matchedUrl) {
      await tx
        .update(galleriesTable)
        .set({
          published: true,
          productId,
        })
        .where(eq(galleriesTable.id, matchedUrl.id));
    }
  } catch (error) {
    throw new Error("Failed update gallery status");
  }
};

export const deleteProductImages = async (productId: string, tx: any) => {
  try {
    await tx.delete(productImagesTable).where(eq(productImagesTable.productId, productId));
  } catch (error) {
    throw new Error("Failed update gallery status");
  }
};

export const deleteProductImageByUrl = async (url: string, tx: any) => {
  try {
    await tx.delete(productImagesTable).where(eq(productImagesTable.url, url));
  } catch (error) {
    throw new Error("Failed update gallery status");
  }
};

export const updateStock = async (orderDetails: OrderItem[]) => {
  try {
    for (const item of orderDetails) {
      const productData = await db.query.products.findFirst({
        where: eq(productsTable.id, item.productId),
        with: {
          variations: {
            with: {
              nestedVariations: true,
            },
          },
          productImages: true,
        },
      });

      if (productData?.variationType === "NESTED_VARIATION") {
        await db
          .update(nestedVariationsTable)
          .set({
            stock: sql`
              CASE
                WHEN ${nestedVariationsTable.stock} - ${item.quantity} <= 0
                THEN 0
                ELSE ${nestedVariationsTable.stock} - ${item.quantity}
              END
            `,
          })
          .where(eq(nestedVariationsTable.id, item.nestedVariationId!));
      } else if (productData?.variationType === "VARIATION") {
        await db
          .update(variationsTable)
          .set({
            stock: sql`
              CASE
                WHEN ${variationsTable.stock} - ${item.quantity} <= 0
                THEN 0
                ELSE ${variationsTable.stock} - ${item.quantity}
              END
            `,
          })
          .where(eq(variationsTable.id, item.variationId!));
      } else {
        await db
          .update(productsTable)
          .set({
            stock: sql`
              CASE
                WHEN ${productsTable.stock} - ${item.quantity} <= 0
                THEN 0
                ELSE ${productsTable.stock} - ${item.quantity}
              END
            `,
          })
          .where(eq(productsTable.id, item.productId!));
      }
      revalidatePath(`products/${productData?.id}`);
    }

    for (const item of orderDetails) {
      const productData = await db.query.products.findFirst({
        where: eq(productsTable.id, item.productId),
        with: {
          variations: {
            with: {
              nestedVariations: true,
            },
          },
          productImages: true,
        },
      });
      const isSomeProductOutOfStock = findSomeProductOutOfStock(productData as Product);

      if (isSomeProductOutOfStock) {
        await updateOutOfStock(item.productId, true);
      }
      revalidatePath(`products/${productData?.id}`);
    }
  } catch (error) {
    console.log("updateStock", error);
    throw new Error("Failed update");
  }
};

export const updateOutOfStock = async (productId: string, isOutOfStock: boolean) => {
  try {
    return await db
      .update(productsTable)
      .set({
        isOutOfStock,
      })
      .where(eq(productsTable.id, productId));
  } catch (error) {
    console.log("Failed update Out Of Stock: ", error);
    throw new Error("Failed update Out Of Stock");
  }
};
