import { NewLoginVerificationTemplate } from "@/components/mail/new-login-verification-template";
import { NewUserInviteTemplate } from "@/components/mail/new-user-invite-template";
import { ResetPasswordTemplate } from "@/components/mail/reset-password-template";
import { TwoFactorTokenTemplate } from "@/components/mail/two-factor-token-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const baseURL = process.env.NEXT_PUBLIC_APP_URL!;
const RESEND_VERIFIED_DOMAIN = process.env.RESEND_VERIFIED_DOMAIN!;

export const sendVerificationEmail = async (email: string, token: string) => {
  if (!baseURL) {
    console.log("Please provide base url");
    return { error: "Something went wrong" };
  }

  if (!RESEND_VERIFIED_DOMAIN) {
    console.log("Please provide resend domain");
    return { error: "Something went wrong" };
  }

  try {
    const confirmLink = `${baseURL}/auth/new-verification?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: `email@${RESEND_VERIFIED_DOMAIN}`,
      to: email,
      subject: "Confirm your email",
      react: NewLoginVerificationTemplate({ firstName: "there", confirmLink }),
    });

    if (error) {
      console.log("Failed send verification email :", error);
      return { error: "Something went wrong" };
    }

    return {
      success: "Email send",
    };
  } catch (error) {
    console.log("Failed send verification email :", error);
    return { error: "Failed send verification email" };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  if (!baseURL) {
    console.log("Please provide base url");
    return { error: "Something went wrong" };
  }

  if (!RESEND_VERIFIED_DOMAIN) {
    console.log("Please provide resend domain");
    return { error: "Something went wrong" };
  }

  try {
    const resetLink = `${baseURL}/auth/new-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: `email@${RESEND_VERIFIED_DOMAIN}`,
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
  if (!token || !email) {
    return { error: "Failed send 2FA Code email" };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: `email@${RESEND_VERIFIED_DOMAIN}`,
      to: email,
      subject: "2FA Code",
      react: TwoFactorTokenTemplate({ firstName: "John", token }),
    });
    if (error) {
      console.log("Failed send 2FA Code email :", error);
      return { error: "Failed send 2FA Code email" };
    }
    return {
      success: "Email send",
    };
  } catch (error) {
    console.log("Failed send 2FA Code email :", error);
    return { error: "Failed send 2FA Code email" };
  }
};

export const sendNewUserInviteEmail = async (email: string) => {
  if (!baseURL) {
    console.log("Please provide base url");
    return { error: "Something went wrong" };
  }

  if (!RESEND_VERIFIED_DOMAIN) {
    console.log("Please provide resend domain");
    return { error: "Something went wrong" };
  }
  const signUpLink = `${baseURL}/auth/sign-up`;

  try {
    const { data, error } = await resend.emails.send({
      from: `email@${RESEND_VERIFIED_DOMAIN}`,
      to: email,
      subject: "Welcome onboard",
      react: NewUserInviteTemplate({ signUpLink }),
    });
    if (error) {
      console.log("Failed send New User Invite Email :", error);
      return { error: "Failed send New User Invite Email" };
    }
    return {
      success: "Email send",
    };
  } catch (error) {
    return { error: "Failed send New User Invite Email" };
  }
};
