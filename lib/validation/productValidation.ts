import { z } from "zod";
import { variationsSchema } from "./variationValidation";
import { productImagesSchema } from "./productImagesValidation";

export const productSchema = z
  .object({
    id: z.string().optional(),
    tags: z.optional(z.array(z.string())),
    productImages: productImagesSchema,
    availableVariations: z.array(z.string()),
    lowestPrice: z.coerce.number(),
    variationType: z
      .string(z.enum(["NESTED_VARIATION", "VARIATION", "NONE"]))
      .min(1, { message: "Please tick variation 1 or 2, or leave it untick" }),
    name: z.string().min(5, { message: "Must be 5 or more characters long" }).max(200, { message: "Name cannot more than 200 character" }),
    variations: z
      .array(variationsSchema)
      .refine(
        (variations) => {
          if (!variations) return true; // If no variations, no need to check uniqueness
          const variationNames = variations.map((variation) => variation.name).filter(Boolean);
          const uniqueNames = new Set(variationNames);
          return variationNames.length === uniqueNames.size;
        },
        {
          message: "Please ensure each VARIATION 1 NAME must be unique",
        }
      )
      .refine(
        (variations) => {
          if (!variations) return true; // If no variations, no need to check nested uniqueness
          return variations.every((variation) => {
            if (!variation.nestedVariations) return true; // If no nested variations, no need to check uniqueness
            const nestedNames = variation.nestedVariations.map((nv) => nv.name).filter(Boolean);
            const uniqueNestedNames = new Set(nestedNames);
            return nestedNames.length === uniqueNestedNames.size;
          });
        },
        {
          message: "Please ensure each VARIATION 2 NAME must be unique",
        }
      )
      .optional(),

    category: z.string().min(1, {
      message: "Please select category",
    }),
    description: z.string().min(100, { message: "Must be 100 or more characters long" }),
    price: z.coerce
      .number({ message: "Price must be a number" })
      .nonnegative({ message: "Cannot less than 0" })
      .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toFixed(2)), {
        message: "Price must have at most two decimal places",
      })
      .optional()
      .or(z.literal(0)),
    stock: z.coerce.number({ message: "Stock must be a number" }).nonnegative({ message: "Cannot less than 0" }).optional().or(z.literal(0)),
    minPurchase: z.coerce.number().min(1).nonnegative({ message: "Cannot less than 0" }),
    maxPurchase: z.coerce.number().min(1).nonnegative({ message: "Cannot less than 0" }),
    isArchived: z.boolean(),
    isFeatured: z.boolean(),
    weight: z.coerce
      .number()
      .min(0.1, {
        message: "Value must be equal or greater than 0.1",
      })
      .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toFixed(2)), {
        message: "Price must have at most two decimal places",
      }),
    shippingFee: z.coerce
      .number()

      .min(0.1, {
        message: "Value must be equal or greater than 0.1",
      })
      .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toFixed(2)), {
        message: "Price must have at most two decimal places",
      }),
  })

  .refine(
    (data) => {
      if (data.variationType === "NESTED_VARIATION" || data.variationType === "VARIATION") {
        return data.variations?.every((item) => item.image !== null && item.image !== undefined && item.image !== "");
      }
      return true;
    },
    {
      message: "Image for variation item is required",
      path: ["variations"],
    }
  )
  .refine(
    (data) => {
      // Check if variations is empty or not present
      if (data.variationType === "NONE") {
        return data.stock !== undefined && data.stock !== null && data.stock > 0;
      }
      return true;
    },
    {
      message: "Stock is required and must be greater than 0",
      path: ["stock"],
    }
  )
  .refine(
    (data) => {
      // Check if variations is empty or not present
      if (data.variationType === "NONE") {
        return !!data.maxPurchase && !!data.stock && data.maxPurchase <= data.stock;
      } else if (data.variationType === "VARIATION") {
        return !!data.variations && data.variations.every((v) => !!data.maxPurchase && !!v.stock && data.maxPurchase <= v.stock);
      } else if (data.variationType === "NESTED_VARIATION") {
        return (
          !!data.variations &&
          data.variations.every(
            (v) => !!v.nestedVariations && v.nestedVariations.every((nv) => !!data.maxPurchase && !!nv.stock && data.maxPurchase <= nv.stock)
          )
        );
      }
      return true;
    },
    {
      message: "Max purchase cannot greater than stock",
      path: ["maxPurchase"],
    }
  )
  .refine(
    (data) => {
      // Check if variations is empty or not present
      if (data.variationType === "NONE") {
        return !!data.stock && data.stock >= 1;
      } else if (data.variationType === "VARIATION") {
        return !!data.variations && data.variations.every((v) => !!v.stock && v.stock >= 1);
      } else if (data.variationType === "NESTED_VARIATION") {
        return (
          !!data.variations && data.variations.every((v) => !!v.nestedVariations && v.nestedVariations.every((nv) => !!nv.stock && nv.stock >= 1))
        );
      }
      return true;
    },
    {
      message: "stock cannot less than 1",
      path: ["stock"],
    }
  )
  .refine(
    (data) => {
      // Check if variations is empty or not present
      if (data.variationType === "NONE") {
        return !!data.minPurchase && !!data.stock && data.minPurchase <= data.stock;
      } else if (data.variationType === "VARIATION") {
        return data.variations?.every((v) => !!data.minPurchase && !!v.stock && data.minPurchase <= v.stock);
      } else if (data.variationType === "NESTED_VARIATION") {
        return data.variations?.every((v) => v.nestedVariations?.every((nv) => !!data.minPurchase && !!nv.stock && data.minPurchase <= nv.stock));
      }
      return true;
    },
    {
      message: "Min purchase cannot greater than stock",
      path: ["minPurchase"],
    }
  )
  .refine(
    (data) => {
      if (data.variationType === "VARIATION") {
        return !!data.variations && data.variations.every((v) => !!v.image && !!v.name && !!v.price && !!v.stock);
      }
      return true;
    },
    {
      message: "All fields in each variation must be filled",
    }
  )
  .refine(
    (data) => {
      if (data.variationType === "NESTED_VARIATION") {
        return data.variations?.every((v) => v.nestedVariations?.every((nv) => !!nv.name && !!nv.price && !!nv.stock));
      }
      return true;
    },
    {
      message: "All fields in each variation must be filled ",
    }
  );

export type TProductSchema = z.infer<typeof productSchema>;

export const deleteProductSchema = z.object({
  id: z.string(),
});

export const productsQuerySchema = z.object({
  query: z.string().max(100).optional().default(""),
  category: z.string().max(50).optional().default(""),
  color: z.array(z.string().max(20)).optional().default([]),
  size: z.array(z.string().max(20)).optional().default([]),
  tags: z.array(z.string().max(20)).optional().default([]),
  page: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "page must be a non-negative number" }
    )
    .default(""),
  minPrice: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "minPrice must be a non-negative number" }
    )
    .default("0"),
  maxPrice: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "maxPrice must be a non-negative number" }
    )
    .default("100000"),
  sort: z.string().max(20).optional().default(""),
});

export type IProductsQuery = z.infer<typeof productsQuerySchema>;
