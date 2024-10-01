"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createCategoryDB, deleteCategoryDB, updateCategoryDB } from "@/lib/services/categoryServices";
import { getProductsWithCategory } from "@/lib/db/queries/admin/products";
import { getCategoryById } from "@/lib/db/queries/admin/categories";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { categorySchema } from "@/lib/validation/categoryValidation";

export const createCategory = async (formData: FormData) => {
  await ensureAuthenticated();

  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }
  try {
    const category = await createCategoryDB(parsed.data.name);
    revalidatePath("/categories");
    revalidateTag("categories");
    return { success: `Category "${category.name}" created 🎉` };
  } catch (error) {
    return {
      error: "Failed to create category",
    };
  }
};

export const editCategory = async (formData: FormData) => {
  await ensureAuthenticated();

  const parsed = categorySchema.safeParse({ id: formData.get("id"), name: formData.get("name") });
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }
  const { id, name } = parsed.data;
  try {
    await updateCategoryDB(name, id!);
    revalidatePath("/categories");
    revalidateTag("categories");
    return { success: `Category changed to "${name}" 🎉` };
  } catch (error) {
    return {
      error: "Failed to edit category",
    };
  }
};

const deleteCategorySchema = z.object({
  id: z.string(),
});
export const deleteCategory = async (formData: FormData) => {
  await ensureAuthenticated();

  const parsed = deleteCategorySchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  try {
    const existingProductWithCategory = await getProductsWithCategory();
    const foundCategory = await getCategoryById(parsed.data.id);

    if (existingProductWithCategory.some((category) => category.categoryName === foundCategory.name)) {
      return {
        error: "Category is in used",
      };
    }

    await deleteCategoryDB(parsed.data.id);

    revalidatePath("/categories");
    revalidateTag("categories");
    return { success: `Category deleted` };
  } catch (error) {
    return {
      error: "Failed to delete category",
    };
  }
};
