import { z } from "zod";
import { nestedVariationsSchema } from "./nestedVariationValidation";
import { allowedImageDomains } from "../constant";

export const variationsSchema = z.object({
  id: z.string().optional(),
  label: z
    .string()
    .min(1, {
      message: "Variation must has min 1 character",
    })
    .max(30, { message: "Cannot more than 30 character" })
    .optional()
    .transform((val) => val?.toLocaleLowerCase())
    .or(z.literal("")),
  image: z
    .string()
    .min(1, {
      message: "Please provide image",
    })
    .url()
    .optional()
    .refine(
      (url) => {
        if (!url) return true;
        try {
          const parsedUrl = new URL(url!);
          return allowedImageDomains.includes(parsedUrl.hostname);
        } catch {
          return false;
        }
      },
      { message: "Image URL must be from an allowed domain" }
    )
    .or(z.literal("")),
  name: z
    .string()
    .min(1, {
      message: "Name must has min 1 character",
    })
    .max(50, { message: "Name cannot more than 50 character" })
    .optional()
    .transform((val) => val?.toLocaleLowerCase())
    .or(z.literal("")),
  price: z.coerce
    .number({ message: "Price must be a number" })
    .min(1)
    .nonnegative({ message: "Price cannot less than 0" })
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toFixed(2)), {
      message: "Price must have at most two decimal places",
    })
    .optional()
    .or(z.literal(0)),
  stock: z.coerce
    .number({ message: "Stock must be a number" })
    .nonnegative({ message: "Stock cannot less than 0" })
    .min(1)
    .optional()
    .or(z.literal(0)),
  sku: z.string().max(50, { message: "sku cannot more than 50 character" }).optional().or(z.literal("")),
  nestedVariations: z.array(nestedVariationsSchema).optional(),
});

export type TVariationsSchema = z.infer<typeof variationsSchema>;
