import { z } from "zod";

export const courierRequestSchema = z.object({
  toPostcode: z.coerce.number().positive(),
  totalWeightInKg: z.coerce.number().positive(),
  courierChoice: z.string(),
  totalHeight: z.coerce.number().positive(),
  totalLength: z.coerce.number().positive(),
  totalWidth: z.coerce.number().positive(),
});

export type CourierRequest = z.infer<typeof courierRequestSchema>;

export const senderFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  dialing_country_code: z.enum(["MY", "SG", "TH"], { message: "Country code is required, eg MY, SG, TH" }),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email").optional(),
  address_1: z.string().min(1, "Address is required"),
  address_2: z.string().optional(),
  postcode: z.string().min(5, "Postcode is required"),
  province: z.string().min(1, "Province is required"),
  city: z.string().min(1, "City is required"),
  country: z.enum(["MY", "SG", "TH"], { message: "Country code is required, eg MY, SG, TH" }),
});

export type TSenderFormSchema = z.infer<typeof senderFormSchema>;
