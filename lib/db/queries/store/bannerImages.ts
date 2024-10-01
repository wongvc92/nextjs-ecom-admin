import { db } from "@/lib/db";
import { bannerImages as bannerImagesTable } from "@/lib/db/schema/bannerImages";
import { asc } from "drizzle-orm";

export const getBannerImages = async () => {
  try {
    const bannerImages = await db
      .select({ id: bannerImagesTable.id, url: bannerImagesTable.url })
      .from(bannerImagesTable)
      .orderBy(asc(bannerImagesTable.order));
    return bannerImages;
  } catch (error) {
    throw new Error("Failed fetch bannerImages");
  }
};
