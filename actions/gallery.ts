"use server";

import { db } from "@/lib/db";
import { getGalleryImageByUrl } from "@/lib/db/queries/admin/galleries";
import { deleteGalleryImageByUrl } from "@/lib/services/galleryServices";
import { ensureAuthenticated } from "@/lib/utils/authHelpers";
import { deleteImageFromS3 } from "@/lib/utils/image";
import { revalidatePath } from "next/cache";

export async function deleteImageFromGallery(url: string) {
  await ensureAuthenticated();

  if (!url || typeof url !== "string") {
    return {
      error: "Failed delete image",
    };
  }
  
  try {
    await deleteImageFromS3(url);

    const checkedUrl = await getGalleryImageByUrl(url);

    if (checkedUrl.productId !== null || checkedUrl.variationId !== null) {
      return {
        error: "Image still in used",
      };
    }
    await db.transaction(async (tx) => {
      await deleteGalleryImageByUrl(url, tx);
    });

    revalidatePath("/galleries");
    return {
      success: "image deleted",
    };
  } catch (e) {
    return {
      error: "Failed delete image",
    };
  }
}
