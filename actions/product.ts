"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  createNewProduct,
  createNewProductImage,
  deleteProductFromDB,
  deleteProductImageByUrl,
  deleteProductImages,
  updateExistingProduct,
  updateGalleryImagePublishedStatusByProductId,
  updateOutOfStock,
} from "@/lib/services/productServices";
import {
  createNewVariation,
  deleteVariationImageByUrl,
  updateExistingVariation,
  updateGalleryImagePublishedStatusByVariationId,
} from "@/lib/services/variationServices";
import { createNewNestedVariation, updateExistingNestedVariation } from "@/lib/services/nestedVariationServices";
import { getProductImageByUrl, getProductImagesByProductId } from "@/lib/db/queries/admin/productImages";
import { deleteGalleryImage, deleteGalleryImageByUrl } from "@/lib/services/galleryServices";
import { getProductById } from "@/lib/db/queries/admin/products";
import { getVariationImageByUrl, getVariationsByProductId } from "@/lib/db/queries/admin/variations";
import { deleteProductSchema, productSchema, TProductSchema } from "@/lib/validation/productValidation";
import { getGalleryImageByUrl } from "@/lib/db/queries/admin/galleries";
import { ensureAuthenticated } from "@/lib/helpers/authHelpers";
import { revalidateStore, revalidateTagStore } from "@/lib/services/storeServices";
import { deleteImageFromS3 } from "@/lib/helpers/awsS3Helpers";

const urlPaths = ["/", "/products"];

export const editProduct = async (values: TProductSchema) => {
  await ensureAuthenticated();

  const parsed = productSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    return { error: errorMessage };
  }

  const { productImages, variations, ...productData } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      // Update product details
      const updatedProduct = await updateExistingProduct(parsed.data, tx);

      await deleteProductImages(updatedProduct.id, tx);

      if (productImages && productImages.length > 0) {
        for (const productImage of productImages) {
          await createNewProductImage(productImage.url, updatedProduct.id, tx);
          await updateGalleryImagePublishedStatusByProductId(productImage.url, updatedProduct.id, tx);
        }
      }

      // Update variations
      if ((productData.variationType === "VARIATION" || productData.variationType === "NESTED_VARIATION") && variations) {
        const previousVariations = variations.filter((v) => v.id);
        const newVariations = variations.filter((v) => !v.id);

        for (const previousVariation of previousVariations) {
          const insertedVariations = await updateExistingVariation(previousVariation, updatedProduct.id, tx);

          for (const insertedVariation of insertedVariations) {
            if (insertedVariation.image !== null) {
              await updateGalleryImagePublishedStatusByVariationId(insertedVariation.image, insertedVariation.id, tx);
            }
          }
          if (
            productData.variationType === "NESTED_VARIATION" &&
            previousVariation.nestedVariations &&
            previousVariation.nestedVariations.length > 0
          ) {
            const previousNestedVariations = previousVariation.nestedVariations.filter((nv) => nv.id);
            const newNestedVariations = previousVariation.nestedVariations.filter((nv) => !nv.id);
            for (const previousNestedVariation of previousNestedVariations) {
              await updateExistingNestedVariation(previousNestedVariation, previousNestedVariation.id!, tx);
            }

            for (const newNestedVariation of newNestedVariations) {
              await createNewNestedVariation(newNestedVariation, previousVariation.id!, tx);
            }
          }
        }

        for (const newVariation of newVariations) {
          const insertedVariations = await createNewVariation(newVariation, updatedProduct.id, tx);

          for (const insertedVariation of insertedVariations) {
            if (insertedVariation.image !== null) {
              await updateGalleryImagePublishedStatusByVariationId(insertedVariation.image, insertedVariation.id, tx);
            }
            if (productData.variationType === "NESTED_VARIATION" && newVariation.nestedVariations && newVariation.nestedVariations.length > 0) {
              const previousNestedVariations = newVariation.nestedVariations.filter((nv) => !nv.id);

              for (const previousNestedVariation of previousNestedVariations) {
                await createNewNestedVariation(previousNestedVariation, insertedVariation.id!, tx);
              }
            }
          }
        }
      }
    });
    await updateOutOfStock(productData.id!, false);
    revalidatePath(`/products/${productData.id!}`);
    await revalidateTagStore([`/products/${productData.id!}`, "featuredProducts"]);
    return { success: "Product updated" };
  } catch (error) {
    return { error: "Failed update product" };
  }
};

export const deleteProduct = async (formData: FormData) => {
  const session = await ensureAuthenticated();

  if (session.user.role !== "ADMIN") {
    return {
      error: "You are not allowed to perform this action",
    };
  }
  const parsed = deleteProductSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    console.error("errorMessage", errorMessage);
    return { error: errorMessage };
  }

  try {
    const productImages = await getProductImagesByProductId(parsed.data.id);

    for (const productImage of productImages) {
      if (productImage.url) {
        await deleteImageFromS3(productImage.url);
        await deleteGalleryImage(productImage.url);
      }
    }

    const product = await getProductById(parsed.data.id);
    if (!product) {
      return {
        error: "Product is not exist or already deleted",
      };
    }

    if (product.variationType === "VARIATION" || product.variationType === "NESTED_VARIATION") {
      const variations = await getVariationsByProductId(parsed.data.id);

      for (const variation of variations) {
        if (variation.image) {
          await deleteImageFromS3(variation.image);
          await deleteGalleryImage(variation.image);
        }
      }
    }

    await deleteProductFromDB(parsed.data.id);
    revalidatePath("/products");
    await revalidateTagStore(["featuredProducts", "products"]);
    return { success: `Product deleted` };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to delete product",
    };
  }
};

export const createProduct = async (values: TProductSchema) => {
  await ensureAuthenticated();

  const parsed = productSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => issue.message).join(", ");
    console.error("errorMessage", errorMessage);
    return { error: errorMessage };
  }

  const { productImages, variations } = parsed.data;
  const isVariation = parsed.data.variationType === "VARIATION";
  const isNestedVariation = parsed.data.variationType === "NESTED_VARIATION";

  try {
    await db.transaction(async (tx) => {
      const newProduct = await createNewProduct(parsed.data, tx);

      // Insert media
      if (productImages && productImages.length > 0) {
        for (const productImage of productImages) {
          await createNewProductImage(productImage.url, newProduct.id, tx);
          await updateGalleryImagePublishedStatusByProductId(productImage.url, newProduct.id, tx);
        }
      }

      // Insert variations and nested variations
      if ((isVariation || isNestedVariation) && variations && variations.length > 0) {
        for (const variation of variations) {
          const insertedVariations = await createNewVariation(variation, newProduct.id, tx);

          for (const variation of insertedVariations) {
            if (variation.image !== null) {
              await updateGalleryImagePublishedStatusByVariationId(variation.image, variation.id, tx);
            }
          }
          if (isNestedVariation && variation.nestedVariations && variation.nestedVariations.length > 0) {
            for (const insertedVariationItem of insertedVariations)
              for (const nestedVariation of variation.nestedVariations) {
                await createNewNestedVariation(nestedVariation, insertedVariationItem.id, tx);
              }
          }
        }
      }
    });
    await revalidateStore(urlPaths);
    revalidatePath("/products");
    await revalidateTagStore(["featuredProducts"]);
    return { success: `Product created 🎉` };
  } catch (error) {
    console.error("Failed create product", error);
    return {
      error: "Failed create product",
    };
  }
};

export const deleteProductImage = async (url: string) => {
  await ensureAuthenticated();

  if (!url || typeof url !== "string") {
    return {
      error: "Failed to delete product Image",
    };
  }
  try {
    await deleteImageFromS3(url);
    await db.transaction(async (tx) => {
      const foundProductImage = await getProductImageByUrl(url);
      if (foundProductImage) {
        await deleteProductImageByUrl(foundProductImage.url, tx);
      }

      const foundGalleryImage = await getGalleryImageByUrl(url);
      if (foundGalleryImage) {
        await deleteGalleryImageByUrl(url, tx);
      }
    });
    await revalidateTagStore(["featuredProducts", "products"]);
    revalidatePath("/products");
    return {
      success: "Image deleted",
    };
  } catch (error) {
    return {
      error: "Failed delete image",
    };
  }
};

export async function deleteVariationImage(url: string) {
  await ensureAuthenticated();

  if (!url || typeof url !== "string") {
    return {
      error: "Failed to delete product Image",
    };
  }

  try {
    await deleteImageFromS3(url);

    await db.transaction(async (tx) => {
      const foundVariationImage = await getVariationImageByUrl(url);
      if (foundVariationImage && foundVariationImage.url !== null) {
        await deleteVariationImageByUrl(url, tx);
      }

      const foundGalleryImage = await getGalleryImageByUrl(url);
      if (foundGalleryImage) {
        await deleteGalleryImageByUrl(url, tx);
      }
    });
    await revalidateTagStore(["featuredProducts", "products"]);
    revalidatePath("/products");
    return {
      success: "Image deleted",
    };
  } catch (error) {
    return {
      error: "Failed delete image",
    };
  }
}
