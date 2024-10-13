import { asc, count, eq } from "drizzle-orm";
import { db } from "../..";
import { BannerImage, bannerImages as bannerImagesTable } from "../../schema/bannerImages";

export const getBannerImages = async ({
  perPage,
  page,
}: {
  perPage: string;
  page: string;
}): Promise<{ banner: BannerImage[]; filteredCounts: number }> => {
  try {
    const banner = await db
      .select()
      .from(bannerImagesTable)
      .orderBy(asc(bannerImagesTable.order))
      .limit(parseInt(perPage))
      .offset((parseInt(page) - 1) * parseInt(perPage));

    const [bannerCount] = await db.select({ count: count() }).from(bannerImagesTable);

    return { banner, filteredCounts: bannerCount.count };
  } catch (error) {
    console.error("Failed fetch banner Images ", error);
    return { banner: [], filteredCounts: 0 };
  }
};

export const getBannerImageById = async (bannerId: string): Promise<BannerImage> => {
  try {
    const [banner] = await db.select().from(bannerImagesTable).where(eq(bannerImagesTable.id, bannerId));
    return banner;
  } catch (error) {
    console.error("Failed fetch Banner Image By Id", error);
    throw new Error("Failed fetch Banner Image By Id");
  }
};

export const getBannerImageByUrl = async (url: string): Promise<BannerImage> => {
  try {
    const [banner] = await db.select().from(bannerImagesTable).where(eq(bannerImagesTable.url, url));
    return banner;
  } catch (error) {
    console.error("Failed fetch banner Image By Url", error);
    throw new Error("Failed fetch banner Image By Url");
  }
};

export const getBannerImagesCount = async () => {
  const [data] = await db.select({ count: count() }).from(bannerImagesTable);

  if (!data) {
    return null;
  }
  return data.count;
};
