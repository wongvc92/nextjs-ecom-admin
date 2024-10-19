"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { createCategoryDB, deleteCategoryDB, updateCategoryDB } from "@/lib/services/categoryServices";
import { getProductByCategoryId } from "@/lib/db/queries/admin/products";
import { getCategoryByName } from "@/lib/db/queries/admin/categories";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { categorySchema } from "@/lib/validation/categoryValidation";
import { revalidateTagStore } from "@/lib/services/storeServices";
import { validate as isUuid } from "uuid";
export const createCategory = async (formData: FormData) => {
  await ensureAuthenticated();

  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }
  try {
    const existingCategory = await getCategoryByName(parsed.data.name);
    if (existingCategory) {
      return {
        error: "Category already exist",
      };
    }
    const category = await createCategoryDB(parsed.data.name);
    revalidatePath("/categories");
    revalidateTag("categories");
    await revalidateTagStore(["categories"]);
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
    await revalidateTagStore(["categories"]);
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
    const existingProductWithCategory = await getProductByCategoryId(parsed.data.id);

    if (existingProductWithCategory) {
      return {
        error: "Category is in used",
      };
    }

    await deleteCategoryDB(parsed.data.id);

    revalidatePath("/categories");
    revalidateTag("categories");
    await revalidateTagStore(["categories"]);
    return { success: `Category deleted` };
  } catch (error) {
    return {
      error: "Failed to delete category",
    };
  }
};

export const deleteMultipleCategories = async (ids: string[]) => {
  if (!ids.length) {
    return {
      error: "ids is needed",
    };
  }

  if (ids.some((id) => !isUuid(id))) {
    return {
      error: "incorrect id format",
    };
  }

  try {
    // Filter out the categories that have products associated with them
    const toDeleteIds = await Promise.all(
      ids.map(async (id) => {
        const existingProductWithCategory = await getProductByCategoryId(id);
        return existingProductWithCategory ? null : id;
      })
    );

    // Remove null values (categories that have associated products)
    const validToDeleteIds = toDeleteIds.filter(Boolean) as string[];

    if (validToDeleteIds.length === 0) {
      return { error: "Categories still in used in product" };
    }

    // Delete categories concurrently
    await Promise.all(validToDeleteIds.map((id) => deleteCategoryDB(id)));

    // Revalidate after successful deletion
    revalidatePath("/categories");
    revalidateTag("categories");
    return { success: `Category deleted` };
  } catch (error) {
    console.log("Failed delete category :", error);
    return { error: `Failed delete category` };
  }
};
