import { eq } from "drizzle-orm";
import { db } from "../..";
import { BannerImage, bannerImages as bannerImagesTable } from "../../schema/bannerImages";

export const getBannerImages = async (): Promise<{ id: string; url: string }[]> => {
  try {
    const banner = await db.select().from(bannerImagesTable);
    return banner;
  } catch (error) {
    throw new Error("Failed fetch banner");
  }
};

export const getBannerImageById = async (bannerId: string): Promise<BannerImage> => {
  try {
    const [banner] = await db.select().from(bannerImagesTable).where(eq(bannerImagesTable.id, bannerId));
    return banner;
  } catch (error) {
    throw new Error("Failed fetch banner");
  }
};

export const getBannerImageByUrl = async (url: string): Promise<BannerImage> => {
  try {
    const [banner] = await db.select().from(bannerImagesTable).where(eq(bannerImagesTable.url, url));
    return banner;
  } catch (error) {
    throw new Error("Failed fetch banner");
  }
};
