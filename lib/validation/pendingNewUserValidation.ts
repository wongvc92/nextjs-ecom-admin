import { z } from "zod";

export const queryPendingNewUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
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
});

export type TQueryPendingNewUserSchema = z.infer<typeof queryPendingNewUserSchema>;
