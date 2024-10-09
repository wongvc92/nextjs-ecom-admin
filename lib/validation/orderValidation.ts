import { z } from "zod";

const statusEnum = z.enum(["cancelled", "pending", "toShip", "shipped", "completed"]);

export const orderQuerySchema = z.object({
  id: z.string().optional(),
  productName: z.string().optional(),
  status: z
    .preprocess((val) => {
      if (Array.isArray(val)) return val;
      if (val !== undefined && val !== "") return [val];
      return [];
    }, z.array(statusEnum))
    .optional(),
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
    .default("1"),
  perPage: z
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
    .default("5"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type TOrdersQuery = z.infer<typeof orderQuerySchema>;

export const updateOrderStatusSchema = z.object({
  id: z.string().uuid(),
  status: statusEnum,
});
