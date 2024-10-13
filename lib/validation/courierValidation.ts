import { z } from "zod";

export const courierRequestSchema = z.object({
  toPostcode: z.preprocess((value) => parseInt(value as string, 10), z.number().positive().int()),
  totalWeightInKg: z.coerce.number().positive(),
  courierChoice: z.string().min(1),
});

export type CourierRequest = z.infer<typeof courierRequestSchema>;
