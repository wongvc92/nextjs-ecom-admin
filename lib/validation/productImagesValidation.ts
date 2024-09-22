import { z } from "zod";
import { allowedImageDomains } from "../constant";

export const productImagesSchema = z
  .array(
    z.object({
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
        )
        .or(z.literal("")),
    })
  )
  .min(1, { message: "Please provide at least 1 image" });

export type TProductImagesType = z.infer<typeof productImagesSchema>;
