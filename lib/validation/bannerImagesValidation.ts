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

export type TBannerImageFormSchema = z.infer<typeof bannerImageSchema>;
