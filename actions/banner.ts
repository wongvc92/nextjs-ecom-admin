"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { revalidateStore } from "@/lib/utils";
import { deleteImageFromS3 } from "@/lib/utils/image";
import { createNewBannerImage, deleteExistingBannerImage, updateGalleryImagePublishedStatusBybannerImageId } from "@/lib/services/bannerServices";
import { getBannerImageByUrl, getBannerImages } from "@/lib/db/queries/admin/banners";
import { getGalleryImageByUrl } from "@/lib/db/queries/admin/galleries";
import { deleteGalleryImageByUrl } from "@/lib/services/galleryServices";
import { bannerImagesSchema, TBannerImagesFormSchema } from "@/lib/validation/bannerImagesValidation";
import { ensureAuthenticated } from "@/lib/utils/authHelpers";

const urlPaths = ["/"];

export const createBanner = async (values: TBannerImagesFormSchema) => {
  await ensureAuthenticated();

  const parsed = bannerImagesSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { bannerImages } = parsed.data;
  try {
    await db.transaction(async (tx) => {
      for (const banner of bannerImages) {
        createNewBannerImage(banner.url, tx);
      }

      const newBannerImages = await getBannerImages();
      for (const item of newBannerImages) {
        await updateGalleryImagePublishedStatusBybannerImageId(item.id, item.url, tx);
      }
    });
    await revalidateStore(urlPaths);
    revalidatePath("/banners");
    return {
      success: "Banners created",
    };
  } catch (error) {
    return {
      error: "Failed create banner",
    };
  }
};

export const editBanner = async (values: TBannerImagesFormSchema) => {
  await ensureAuthenticated();

  const parsed = bannerImagesSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { bannerImages } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      for (const bannerImage of bannerImages) {
        await deleteExistingBannerImage(bannerImage.url, tx);
        await createNewBannerImage(bannerImage.url, tx);
      }
      const newBannerImages = await getBannerImages();
      for (const item of newBannerImages) {
        await updateGalleryImagePublishedStatusBybannerImageId(item.url, item.id, tx);
      }
    });
    await revalidateStore(urlPaths);
    revalidatePath("/banners");
    return {
      success: "Banner edited",
    };
  } catch (error) {
    return {
      error: "Failed Edit banner",
    };
  }
};

export async function deleteCropBanner(url: string) {
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
        await deleteExistingBannerImage(url, tx);
      }

      const foundGalleryImage = await getGalleryImageByUrl(url);
      if (foundGalleryImage) {
        await deleteGalleryImageByUrl(url, tx);
      }
    });
    await revalidateStore(urlPaths);
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
  try {
    await ensureAuthenticated();
    if (!url || typeof url !== "string") {
      return {
        error: "something went wrong",
      };
    }

    await deleteImageFromS3(url);

    await db.transaction(async (tx) => {
      const foundBannerImage = await getBannerImageByUrl(url);
      if (foundBannerImage) {
        await deleteExistingBannerImage(url, tx);
      }

      const foundGalleryImage = await getGalleryImageByUrl(url);
      if (foundGalleryImage) {
        await deleteGalleryImageByUrl(url, tx);
      }
    });
    await revalidateStore(urlPaths);
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
