"use server";

import { db } from "@/lib/db";
import { passwordResetTokens, twoFactorConfirmations, twoFactorTokens, users, verificationTokens } from "@/lib/db/schema/users";
import {
  newPasswordSchema,
  resetSignInSchema,
  signInSchema,
  signUpSchema,
  TNewPasswordSchema,
  TResetSignInSchema,
  TSettingsSchema,
  TSignInSchema,
  TSignUpFormSchema,
} from "@/lib/validation/auth-validation";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_REDIRECT_LOGIN } from "@/routes";
import { getUserByEmail, getUserById } from "@/lib/db/queries/admin/users";
import { sendPasswordResetEmail, sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/services/emailServices";
import { getPasswordResetTokenByToken, getTwoFactorTokenByEmail, getVerificationTokenByToken } from "@/lib/db/queries/admin/auth";
import { getTwoFactorConfirmationByUserId } from "@/lib/db/queries/admin/auth";
import { UserRoleEnum } from "@/@types/next-auth";
import { generatePasswordResetToken, generateTwoFactorToken, generateVerificationToken } from "@/lib/services/authServices";

export const registerUser = async (formData: TSignUpFormSchema): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = signUpSchema.safeParse(formData);

    if (!validatedData.success) {
      console.log(validatedData.error);
      return {
        error: "Invalid fields",
      };
    }
    const { email, password } = validatedData.data;

    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    if (existingUser) {
      return {
        error: "Email already exist, please sign in",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {
      success: "Confirmation email sent!",
    };
  } catch (error) {
    console.error("Sign Up Error:", error);
    return {
      error: "Failed sign up account",
    };
  }
};

export const signInUser = async (
  formData: TSignInSchema,
  callbackUrl?: string | null
): Promise<{ error?: string; success?: string; twoFactor?: boolean }> => {
  const validatedData = signInSchema.safeParse(formData);
  if (!validatedData.success) {
    return {
      error: "Something went wrong",
    };
  }

  const { email, password, code } = validatedData.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: "Email does not exist",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {
      success: "Confirmation email sent!",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return {
          error: "Invalid code!",
        };
      }
      if (twoFactorToken.token !== code) {
        return {
          error: "Invalid code!",
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return {
          error: "Code expired",
        };
      }

      await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id));

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        await db.delete(twoFactorConfirmations).where(eq(twoFactorConfirmations.id, existingConfirmation.id));
      }

      await db.insert(twoFactorConfirmations).values({
        userId: existingUser.id,
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_REDIRECT_LOGIN,
    });

    return { success: "Signed in successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials.",
          };
        default:
          return {
            error: "Something went wrong.",
          };
      }
    }
    throw error;
  }
};

export const newVerification = async (token: string): Promise<{ error?: string; success?: string }> => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error: "Token does not exist!",
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return {
      error: "Token has expired!",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: "Email does not exist",
    };
  }

  await db.update(users).set({ emailVerified: new Date(), email: existingToken.email }).where(eq(users.id, existingUser.id));

  await db.delete(verificationTokens).where(eq(verificationTokens.id, existingToken.id));

  return {
    success: "Email verified!",
  };
};

export const resetSignIn = async (formData: TResetSignInSchema): Promise<{ error?: string; success?: string }> => {
  const validatedData = resetSignInSchema.safeParse(formData);

  if (!validatedData.success) {
    return {
      error: "Invalid email",
    };
  }

  const { email } = validatedData.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
  return {
    success: "Reset email sent!",
  };
};

export const newPassword = async (formData: TNewPasswordSchema, token: string): Promise<{ error?: string; success?: string }> => {
  if (!token) {
    return {
      error: "Missing token!",
    };
  }

  const validatedData = newPasswordSchema.safeParse(formData);
  if (!validatedData.success) {
    return {
      error: "Something went wrong",
    };
  }

  const { password } = validatedData.data;
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      error: "Token does not exist!",
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error: "Token has expired!",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: "Email does not exist",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, existingUser.id));

  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));

  return {
    success: "Password updated!",
  };
};

export const signOutUser = async () => {
  //can do server side stuff before signout
  await signOut();
};

export const settings = async (formData: TSettingsSchema) => {
  const session = await auth();
  if (!session?.user) {
    return {
      error: "Unauthorized",
    };
  }

  const dbUser = await getUserById(session.user.id);

  if (!dbUser) {
    return {
      error: "Unauthorized",
    };
  }

  if (session.user.isOAuth) {
    formData.email = undefined;
    formData.password = undefined;
    formData.newPassword = undefined;
    formData.isTwoFactorEnabled = undefined;
  }

  if (formData.email && formData.email !== session.user.email) {
    const existingUser = await getUserByEmail(formData.email);
    if (existingUser && existingUser.id !== session.user.id) {
      return {
        error: "Email already in used!",
      };
    }

    const verificationToken = await generateVerificationToken(formData.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return {
      success: "Verification email sent!",
    };
  }

  if (formData.password && formData.newPassword && dbUser.password) {
    const passwordMatched = await bcrypt.compare(formData.password, dbUser.password);
    if (!passwordMatched) {
      return {
        error: "Incorrect password!",
      };
    }

    const hashedPassword = await bcrypt.hash(formData.newPassword, 10);

    formData.password = hashedPassword;
    formData.newPassword = undefined;
  }

  await db
    .update(users)
    .set({
      ...formData,
      role: formData.role as UserRoleEnum,
    })
    .where(eq(users.id, dbUser.id));

  return { success: "Settings updated" };
};
