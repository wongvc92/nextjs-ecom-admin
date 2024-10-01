"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  createNewBannerImage,
  deleteExistingBannerImageByUrl,
  EditExistingBannerImage,
  updateGalleryImagePublishedStatusBybannerImageId,
} from "@/lib/services/bannerServices";
import { getBannerImageById, getBannerImageByUrl, getBannerImages, getBannerImagesCount } from "@/lib/db/queries/admin/banners";
import { getGalleryImageByUrl } from "@/lib/db/queries/admin/galleries";
import { deleteGalleryImageByUrl } from "@/lib/services/galleryServices";
import { bannerImageSchema, TBannerImageFormSchema } from "@/lib/validation/bannerImagesValidation";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { revalidateStore } from "@/lib/services/storeServices";
import { deleteImageFromS3 } from "@/lib/helpers/awsS3Helpers";
import { allowedImageDomains } from "@/lib/constant";
import { bannerImages } from "@/lib/db/schema/bannerImages";
import { eq } from "drizzle-orm";

const urlPaths = ["/"];

export const createBanner = async (values: TBannerImageFormSchema, orderNumber: number) => {
  await ensureAuthenticated();

  const parsed = bannerImageSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  if (typeof orderNumber !== "number") {
    return { error: "somnething went wrong" };
  }

  const { url } = parsed.data;
  try {
    await db.transaction(async (tx) => {
      const newBanner = await createNewBannerImage(url, orderNumber, tx);

      await updateGalleryImagePublishedStatusBybannerImageId(newBanner.url, newBanner.id, tx);
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
    await revalidateStore(urlPaths);
    revalidatePath("/banners");
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
    await revalidateStore(urlPaths);
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

export async function updateBannerOrderById(id: string, newOrder: number) {
  try {
    await db
      .update(bannerImages)
      .set({
        order: newOrder,
      })
      .where(eq(bannerImages.id, id));
    revalidatePath("/banners");
    await revalidateStore(urlPaths);
  } catch (error) {
    console.error("Error updating banner order:", error);
    throw new Error("Failed to update banner order");
  }
}
