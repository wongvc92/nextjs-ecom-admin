import { BannerImage, bannerImages as bannerImagesTable } from "@/lib/db/schema/bannerImages";
import { galleries as galleriesTable } from "@/lib/db/schema/galleries";
import { eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

export const createNewBannerImage = async (url: string, orderNumber: number, tx: PgTransaction<any, any, any>): Promise<BannerImage> => {
  try {
    const [newBanner] = await tx
      .insert(bannerImagesTable)
      .values({
        url,
        order: orderNumber,
      })
      .returning();
    return newBanner;
  } catch (error) {
    throw new Error("Failed create new banner image");
  }
};

export const deleteExistingBannerImageByUrl = async (url: string, tx: PgTransaction<any, any, any>) => {
  return await tx.delete(bannerImagesTable).where(eq(bannerImagesTable.url, url));
};

export const EditExistingBannerImage = async (id: string, url: string, tx: PgTransaction<any, any, any>): Promise<BannerImage> => {
  try {
    const [newBanner] = await tx
      .update(bannerImagesTable)
      .set({
        url,
      })
      .where(eq(bannerImagesTable.id, id))
      .returning();
    return newBanner;
  } catch (error) {
    throw new Error("Failed create new banner image");
  }
};

export const updateGalleryImagePublishedStatusBybannerImageId = async (url: string, bannerImageId: string, tx: PgTransaction<any, any, any>) => {
  try {
    const [matchedUrl] = await tx.select({ id: galleriesTable.id }).from(galleriesTable).where(eq(galleriesTable.url, url));

    if (matchedUrl) {
      await tx
        .update(galleriesTable)
        .set({
          published: true,
          bannerImageId,
        })
        .where(eq(galleriesTable.id, matchedUrl.id));
    }
  } catch (error) {
    throw new Error("Failed update gallery status");
  }
};
