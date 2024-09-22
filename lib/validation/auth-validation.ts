import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Please enter the same password.",
    path: ["confirmPassword"],
  });

export type TSignUpFormSchema = z.infer<typeof signUpSchema>;

export const settingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email("Invalid email address")),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.string(z.enum(["ADMIN", "USER"])),
    password: z.optional(z.string().min(6, "Password must be at least 6 characters")),
    newPassword: z.optional(z.string().min(6, "Password must be at least 6 characters")),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "NewPassword is required.",
      path: ["newPassword"],
    }
  );

export type TSettingsSchema = z.infer<typeof settingsSchema>;

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  code: z.optional(z.string()),
});

export type TSignInSchema = z.infer<typeof signInSchema>;

export const newPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type TNewPasswordSchema = z.infer<typeof newPasswordSchema>;

export const resetSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type TResetSignInSchema = z.infer<typeof resetSignInSchema>;
