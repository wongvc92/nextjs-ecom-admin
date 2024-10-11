"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { validate as isUuid } from "uuid";
import {
  createNewBannerImage,
  deleteExistingBannerImageByUrl,
  EditExistingBannerImage,
  updateGalleryImagePublishedStatusBybannerImageId,
} from "@/lib/services/bannerServices";
import { getBannerImageById, getBannerImageByUrl, getBannerImages } from "@/lib/db/queries/admin/banners";
import { getGalleryImageByUrl } from "@/lib/db/queries/admin/galleries";
import { deleteGalleryImageByUrl } from "@/lib/services/galleryServices";
import { bannerImageSchema, TBannerImageFormSchema } from "@/lib/validation/bannerImagesValidation";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { revalidateStore, revalidateTagStore } from "@/lib/services/storeServices";
import { deleteImageFromS3 } from "@/lib/helpers/awsS3Helpers";
import { allowedImageDomains } from "@/lib/constant";
import { bannerImages as bannerImagesTable } from "@/lib/db/schema/bannerImages";
import { eq, sql } from "drizzle-orm";

export const createBanner = async (values: TBannerImageFormSchema) => {
  await ensureAuthenticated();

  const parsed = bannerImageSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { url } = parsed.data;
  try {
    await db.transaction(async (tx) => {
      const [maxOrderResult] = await tx.select({ maxOrder: sql`MAX(${bannerImagesTable.order})` }).from(bannerImagesTable);
      let newOrder = 1;
      if (maxOrderResult && maxOrderResult.maxOrder !== null) {
        newOrder = (maxOrderResult.maxOrder as number) + 1;
      }
      const newBanner = await createNewBannerImage(url, newOrder, tx);

      await updateGalleryImagePublishedStatusBybannerImageId(newBanner.url, newBanner.id, tx);
    });

    revalidatePath("/banners");
    revalidateTag("banners");
    await revalidateTagStore(["banners"]);
    return {
      success: "Banners created",
    };
  } catch (error) {
    return {
      error: "Failed create banner",
    };
  }
};

export const editBanner = async (values: TBannerImageFormSchema) => {
  await ensureAuthenticated();

  const parsed = bannerImageSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    console.log("errorMessage", errorMessage);
    return { error: errorMessage };
  }

  const { id, url } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      await EditExistingBannerImage(id, url, tx);
      await updateGalleryImagePublishedStatusBybannerImageId(url, id, tx);
    });
    revalidateTag("banners");
    revalidatePath(`/banners${id}`);
    return {
      success: "Banner edited",
    };
  } catch (error) {
    console.log("Failed Edit banner", error);
    return {
      error: "Failed Edit banner",
    };
  }
};

export async function deleteCropBanner(url: string) {
  await ensureAuthenticated();

  if (!url || typeof url !== "string" || !allowedImageDomains.includes(url)) {
    return {
      error: "something went wrong",
    };
  }

  try {
    await deleteImageFromS3(url);

    await db.transaction(async (tx) => {
      const foundBannerImage = await getBannerImageByUrl(url);
      if (foundBannerImage) {
        await deleteExistingBannerImageByUrl(url, tx);
      }

      const foundGalleryImage = await getGalleryImageByUrl(url);
      if (foundGalleryImage) {
        await deleteGalleryImageByUrl(url, tx);
      }
    });

    revalidatePath("/banners");

    return {
      success: "image deleted",
    };
  } catch (error) {
    return {
      error: "Failed delete banner image",
    };
  }
}

export async function deleteBanner(url: string) {
  await ensureAuthenticated();
  if (!url || typeof url !== "string") {
    return {
      error: "something went wrong",
    };
  }

  try {
    await deleteImageFromS3(url);

    await db.transaction(async (tx) => {
      const foundBannerImage = await getBannerImageByUrl(url);

      if (foundBannerImage) {
        await deleteExistingBannerImageByUrl(url, tx);
      }

      const foundGalleryImage = await getGalleryImageByUrl(url);
      if (foundGalleryImage) {
        await deleteGalleryImageByUrl(url, tx);
      }
    });
    revalidateTag("banners");
    revalidatePath("/banners");
    return {
      success: "Banner deleted",
    };
  } catch (error) {
    console.error("Failed delete banner image: ", error);
    return {
      error: "Failed delete banner image",
    };
  }
}

export async function deleteBannerById(id: string) {
  try {
    await ensureAuthenticated();
    if (!id || typeof id !== "string") {
      return {
        error: "something went wrong",
      };
    }
    const bannerImage = await getBannerImageById(id);
    await deleteImageFromS3(bannerImage.url);

    await db.transaction(async (tx) => {
      const foundBannerImage = await getBannerImageByUrl(bannerImage.url);
      if (foundBannerImage) {
        await deleteExistingBannerImageByUrl(bannerImage.url, tx);
      }

      const foundGalleryImage = await getGalleryImageByUrl(bannerImage.url);
      if (foundGalleryImage) {
        await deleteGalleryImageByUrl(bannerImage.url, tx);
      }
    });
    revalidateTag("banners");
    revalidatePath("/banners");
    return {
      success: "Banner deleted",
    };
  } catch (error) {
    return {
      error: "Failed delete banner image",
    };
  }
}

export async function moveBannerUp(id: string) {
  if (!isUuid(id)) {
    return {
      error: "Not valid banner id",
    };
  }
  const currentBanner = await getBannerImageById(id);

  if (!currentBanner) {
    return {
      error: "banner not found",
    };
  }

  const currentOrder = currentBanner.order;

  // Find the banner image with the order just before the current one
  const previousBanner = await db
    .select()
    .from(bannerImagesTable)
    .where(eq(bannerImagesTable.order, currentOrder - 1))
    .then((rows) => rows[0]);

  if (!previousBanner) {
    // Cannot move up; already at the top
    return;
  }

  // Swap the order of the current and previous banners
  await db.transaction(async (trx) => {
    await trx
      .update(bannerImagesTable)
      .set({ order: currentOrder - 1 })
      .where(eq(bannerImagesTable.id, id));

    await trx.update(bannerImagesTable).set({ order: currentOrder }).where(eq(bannerImagesTable.id, previousBanner.id));
  });

  revalidatePath("/banners");
  revalidateTag("banners");
}

export async function moveBannerDown(id: string) {
  if (!isUuid(id)) {
    return {
      error: "Not valid banner id",
    };
  }
  const currentBanner = await getBannerImageById(id);

  if (!currentBanner) {
    return {
      error: "banner not found",
    };
  }

  const currentOrder = currentBanner.order;

  // Find the banner image with the order just after the current one
  const nextBanner = await db
    .select()
    .from(bannerImagesTable)
    .where(eq(bannerImagesTable.order, currentOrder + 1))
    .then((rows) => rows[0]);

  if (!nextBanner) {
    // Cannot move down; already at the bottom
    return;
  }

  // Swap the order of the current and next banners
  await db.transaction(async (trx) => {
    await trx
      .update(bannerImagesTable)
      .set({ order: currentOrder + 1 })
      .where(eq(bannerImagesTable.id, id));

    await trx.update(bannerImagesTable).set({ order: currentOrder }).where(eq(bannerImagesTable.id, nextBanner.id));
  });

  revalidateTag("banners");
  revalidatePath("/banners");
}
