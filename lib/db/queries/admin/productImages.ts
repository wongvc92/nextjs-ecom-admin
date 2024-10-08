import { eq } from "drizzle-orm";
import { db } from "../..";
import { productImages as productImagesTable } from "@/lib/db/schema/productImages";


export const getProductImagesByProductId = async (productId: string) => {
  try {
    const productImages = await db
      .select({ url: productImagesTable.url })
      .from(productImagesTable)
      .where(eq(productImagesTable.productId, productId));
    return productImages;
  } catch (error) {
    throw new Error("Failed fetch product images");
  }
};

export const getProductImageByUrl = async (url: string) => {
  try {
    const [productImage] = await db.select({ url: productImagesTable.url }).from(productImagesTable).where(eq(productImagesTable.url, url));
    return productImage;
  } catch (error) {
    throw new Error("Failed fetch product images");
  }
};
