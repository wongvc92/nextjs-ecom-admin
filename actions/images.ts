"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createGalleryImageDB } from "@/lib/services/galleryServices";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { getSignedURLFromS3 } from "@/lib/helpers/awsS3Helpers";
import { allowedFileSize } from "@/lib/constant";

const getSignedURLSchema = z.object({
  size: z.coerce.number(),
  type: z.string(),
  checksum: z.string(),
});

export async function getSignedURL(formData: FormData) {
  await ensureAuthenticated();

  const parsed = getSignedURLSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }
  const { checksum, size, type } = parsed.data;
  //check allowed content
  if (!type.startsWith("image")) {
    return { error: "Only image allowed" };
  }

  //check allowed size
  if (size > allowedFileSize) {
    return { error: "Failed to upload image, max size 1Mb only" };
  }

  try {
    const { fileUrl, signedURL } = await getSignedURLFromS3(type, size, checksum);

    await createGalleryImageDB(fileUrl);

    revalidatePath("/banners");
    return {
      success: {
        url: signedURL,
        type: type.startsWith("image") ? "image" : "video",
      },
    };
  } catch (error) {
    return { failure: "Failed upload image" };
  }
}
