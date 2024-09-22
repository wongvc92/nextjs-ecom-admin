import { EmailTemplate } from "@/components/mail/email-template";
import { ResetPasswordTemplate } from "@/components/mail/reset-password-template";
import { TwoFactorTokenTemplate } from "@/components/mail/two-factor-token-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL;
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `${DOMAIN}/auth/new-verification?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Confirm your email",
      react: EmailTemplate({ firstName: "John", confirmLink }),
    });

    if (error) {
      return { error: "Something went wrong" };
    }

    return {
      success: "Email send",
    };
  } catch (error) {
    return { error: "Failed send verification email" };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${DOMAIN}/auth/new-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      react: ResetPasswordTemplate({ firstName: "John", resetLink }),
    });

    if (error) {
      return { error: "Something went wrong" };
    }

    return {
      success: "Email send",
    };
  } catch (error) {
    return { error: "Failed send verification email" };
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "2FA Code",
      react: TwoFactorTokenTemplate({ firstName: "John", token }),
    });

    return {
      success: "Email send",
    };
  } catch (error) {
    return { error: "Failed send verification email" };
  }
};
