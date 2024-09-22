import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(30, {
    message: "30 max character allowed",
  }),
});

export type TCategorySchema = z.infer<typeof categorySchema>;
