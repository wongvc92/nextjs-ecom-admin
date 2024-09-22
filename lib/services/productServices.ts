import { products as productsTable } from "@/lib/db/schema/products";
import { convertKilogramToGram, convertTwoDecimalNumberToCents } from "../utils";
import { productImages as productImagesTable } from "@/lib/db/schema/productImages";
import { galleries as galleriesTable } from "@/lib/db/schema/galleries";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { TProductSchema } from "../validation/productValidation";

export const createNewProduct = async (productData: TProductSchema, tx: any): Promise<{ id: string }> => {
  try {
    const [createdProduct] = await tx
      .insert(productsTable)
      .values({
        ...productData,
        tags: productData?.tags && productData.tags.length > 0 ? productData.tags : [],
        priceInCents: productData.price ? convertTwoDecimalNumberToCents(productData.price) : 0,
        shippingFeeInCents: convertTwoDecimalNumberToCents(productData.shippingFee),
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
        shippingFeeInCents: convertTwoDecimalNumberToCents(productData.shippingFee),
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
