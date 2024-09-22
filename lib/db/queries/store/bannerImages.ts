import { db } from "@/lib/db";
import { bannerImages as bannerImagesTable } from "@/lib/db/schema/bannerImages";

export const getBannerImages = async () => {
  try {
    const bannerImages = await db.select({ id: bannerImagesTable.id, url: bannerImagesTable.url }).from(bannerImagesTable);
    return bannerImages;
  } catch (error) {
    throw new Error("Failed fetch bannerImages");
  }
};
