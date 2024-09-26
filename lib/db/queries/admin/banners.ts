import { eq } from "drizzle-orm";
import { db } from "../..";
import { BannerImage, bannerImages as bannerImagesTable } from "../../schema/bannerImages";
import { cache } from "react";

export const getBannerImages = cache(async (): Promise<{ id: string; url: string }[]> => {
  try {
    const banner = await db.select().from(bannerImagesTable);
    return banner;
  } catch (error) {
    throw new Error("Failed fetch banner");
  }
});

export const getBannerImageById = cache(async (bannerId: string): Promise<BannerImage> => {
  try {
    const [banner] = await db.select().from(bannerImagesTable).where(eq(bannerImagesTable.id, bannerId));
    return banner;
  } catch (error) {
    throw new Error("Failed fetch banner");
  }
});

export const getBannerImageByUrl = cache(async (url: string): Promise<BannerImage> => {
  try {
    const [banner] = await db.select().from(bannerImagesTable).where(eq(bannerImagesTable.url, url));
    return banner;
  } catch (error) {
    throw new Error("Failed fetch banner");
  }
});
