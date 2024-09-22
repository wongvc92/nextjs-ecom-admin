import { bannerImages as bannerImagesTable } from "@/lib/db/schema/bannerImages";
import { galleries as galleriesTable } from "@/lib/db/schema/galleries";
import { eq } from "drizzle-orm";

export const createNewBannerImage = async (url: string, tx: any) => {
  try {
    await tx.insert(bannerImagesTable).values({
      url,
    });
  } catch (error) {
    throw new Error("Failed create new banner image");
  }
};

export const deleteExistingBannerImage = async (url: string, tx: any) => {
  try {
    await tx.delete(bannerImagesTable).where(eq(bannerImagesTable.id, url));
  } catch (error) {
    throw new Error("Failed delete banner image");
  }
};
export const updateGalleryImagePublishedStatusBybannerImageId = async (url: string, bannerImageId: string, tx: any) => {
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
