import { eq } from "drizzle-orm";
import { db } from "../..";
import {
  Account,
  accounts,
  PasswordResetToken,
  passwordResetTokens,
  TwoFactorConfirmation,
  twoFactorConfirmations,
  TwoFactorToken,
  twoFactorTokens,
  VerificationToken,
  verificationTokens,
} from "../../schema/users";

export const getVerificationTokenByToken = async (token: string): Promise<VerificationToken | null> => {
  try {
    const [verificationToken] = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token));
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string): Promise<VerificationToken | null> => {
  try {
    const [verificationToken] = await db.select().from(verificationTokens).where(eq(verificationTokens.email, email));
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string): Promise<PasswordResetToken | null> => {
  try {
    const [passwordToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    return passwordToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string): Promise<PasswordResetToken | null> => {
  try {
    const [passwordToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.email, email));
    return passwordToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string): Promise<TwoFactorToken | null> => {
  try {
    const [twoFactorToken] = await db.select().from(twoFactorTokens).where(eq(twoFactorTokens.token, token));
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string): Promise<TwoFactorToken | null> => {
  try {
    const [twoFactorToken] = await db.select().from(twoFactorTokens).where(eq(twoFactorTokens.email, email));
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getAccoutByUserId = async (userId: string): Promise<Account | null> => {
  try {
    const [account] = await db.select().from(accounts).where(eq(accounts.userId, userId));
    return account;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorConfirmationByUserId = async (userId: string): Promise<TwoFactorConfirmation | null> => {
  try {
    const [twoFactorConfirmation] = await db.select().from(twoFactorConfirmations).where(eq(twoFactorConfirmations.userId, userId));
    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
