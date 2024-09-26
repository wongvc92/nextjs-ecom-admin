import { and, count, eq } from "drizzle-orm";
import { galleries as galleriesTable, Gallery } from "../../schema/galleries";
import { db } from "../..";
import { cache } from "react";

export const getGalleries = cache(
  async (page: number, published: string): Promise<{ galleries: Gallery[]; perPage: number; galleryCount: number }> => {
    const IMAGE_PER_PAGE = 12;

    const galleriesConditions = [];
    if (published) {
      const isPublishedBoolean = published === "TRUE" ? true : published === "FALSE" ? false : false;
      galleriesConditions.push(eq(galleriesTable.published, isPublishedBoolean));
    }

    const galleryImages = await db
      .select()
      .from(galleriesTable)
      .limit(IMAGE_PER_PAGE)
      .offset((page - 1) * 6)
      .where(and(...galleriesConditions));

    const [galleryCount] = await db
      .select({ count: count() })
      .from(galleriesTable)
      .where(and(...galleriesConditions));

    return { galleries: galleryImages, perPage: IMAGE_PER_PAGE, galleryCount: galleryCount.count };
  }
);

export const getGalleryStatsCount = cache(async () => {
  try {
    const [allGallery] = await db.select({ count: count() }).from(galleriesTable);
    const [publisedGallery] = await db.select({ count: count() }).from(galleriesTable).where(eq(galleriesTable.published, true));
    const [unpublisedGallery] = await db.select({ count: count() }).from(galleriesTable).where(eq(galleriesTable.published, false));

    return {
      allGalleryCount: allGallery.count,
      publisedGalleryCount: publisedGallery.count,
      unpublisedGalleryCount: unpublisedGallery.count,
    };
  } catch (error) {
    console.error("Error fetching product stats:", error);
    throw new Error("Failed fetch product stats");
  }
});

export const getGalleryImageByUrl = cache(async (url: string) => {
  try {
    const [galleryImage] = await db.select().from(galleriesTable).where(eq(galleriesTable.url, url));
    return galleryImage;
  } catch (error) {
    throw new Error("Failed fetch gallery image by url");
  }
});
