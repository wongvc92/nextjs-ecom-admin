import { z } from "zod";
import { allowedImageDomains } from "../constant";

// Define a single image schema
export const bannerImageSchema = z.object({
  id: z.string(),
  url: z
    .string()
    .url()
    .refine(
      (url) => {
        try {
          const parsedUrl = new URL(url);
          return allowedImageDomains.includes(parsedUrl.hostname);
        } catch {
          return false;
        }
      },
      { message: "Image URL must be from an allowed domain" }
    ),
});

// Define the schema for an object containing bannerImages as an array
export const bannerImagesSchema = z.object({
  bannerImages: z.array(bannerImageSchema),
});

export type TBannerImagesFormSchema = z.infer<typeof bannerImagesSchema>;
