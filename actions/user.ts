"use server";

import { getUserByEmail } from "@/lib/db/queries/admin/users";
import { sendNewUserInviteEmail } from "@/lib/services/emailServices";
import { addPendingUserDB } from "@/lib/services/pendingNewUserServices";
import { addBlocklistUserDB, makeAdminDB, makeUserDB, undoBlocklistUserDB } from "@/lib/services/userServices";
import { userFormSchema } from "@/lib/validation/userValidation";
import { revalidatePath } from "next/cache";

export const inviteNewUser = async (formData: FormData) => {
  const parsedResult = userFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsedResult.success) {
    const errorMessage = parsedResult.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { email } = parsedResult.data;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        error: `user with ${email} already exist`,
      };
    }
    await addPendingUserDB(email);
    const res = await sendNewUserInviteEmail(email);
    if (res.error) {
      return {
        error: res.error,
      };
    }
    revalidatePath("/users");
    return {
      success: res.success,
    };
  } catch (error) {
    console.error(`Failed invite new user ${email} `, error);
    return {
      error: `Failed invite new user ${email}`,
    };
  }
};

export const blockUser = async (formData: FormData) => {
  const parsedResult = userFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsedResult.success) {
    const errorMessage = parsedResult.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { email } = parsedResult.data;
  try {
    await addBlocklistUserDB(email);
    revalidatePath("/users");
    return {
      success: `${email} is added to blocked list`,
    };
  } catch (error) {
    console.error(`Failed add ${email} to blocked list :`, error);
    return {
      error: `Failed add ${email} to blocked list`,
    };
  }
};

export const unblockUser = async (formData: FormData) => {
  const parsedResult = userFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsedResult.success) {
    const errorMessage = parsedResult.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { email } = parsedResult.data;
  try {
    await undoBlocklistUserDB(email);
    revalidatePath("/users");
    return {
      success: `${email} is undo to blocked list`,
    };
  } catch (error) {
    console.error(`Failed undo ${email} to blocked list :`, error);
    return {
      error: `Failed undo ${email} to blocked list`,
    };
  }
};

export const makeAdmin = async (formData: FormData) => {
  const parsedResult = userFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsedResult.success) {
    const errorMessage = parsedResult.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { email } = parsedResult.data;
  try {
    await makeAdminDB(email);
    revalidatePath("/users");
    return {
      success: `${email} is added to admin role`,
    };
  } catch (error) {
    console.error(`Failed make ${email} to admin role :`, error);
    return {
      error: `Failed make ${email} to admin role`,
    };
  }
};

export const makeUser = async (formData: FormData) => {
  const parsedResult = userFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsedResult.success) {
    const errorMessage = parsedResult.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { email } = parsedResult.data;
  try {
    await makeUserDB(email);
    revalidatePath("/users");
    return {
      success: `${email} is added to user role`,
    };
  } catch (error) {
    console.error(`Failed make ${email} to user role :`, error);
    return {
      error: `Failed make ${email} to user role`,
    };
  }
};
