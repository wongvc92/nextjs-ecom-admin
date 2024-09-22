import { z } from "zod";

export const trackingNumberSchema = z.object({
  tracking: z.string().min(2, {
    message: "tracking number must be at least 2 characters.",
  }),
  orderId: z.string().uuid(),
});

export type TtrackingNumberSchema = z.infer<typeof trackingNumberSchema>;
