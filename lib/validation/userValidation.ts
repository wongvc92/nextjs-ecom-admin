import { z } from "zod";

export const queryUserSchema = z.object({
  id: z.string().optional(),
  role: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  isBlocked: z.string().optional(),
  isTwoFactorEnabled: z.string().optional(),
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

export type TQueryUser = z.infer<typeof queryUserSchema>;

export const userFormSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
});

export type TuserFormSchema = z.infer<typeof userFormSchema>;
