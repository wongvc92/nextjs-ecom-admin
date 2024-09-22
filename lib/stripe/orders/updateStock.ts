import { products as productsTable } from "@/lib/db/schema/products";
import { nestedVariations as nestedVariationsTable } from "@/lib/db/schema/nestedVariations";
import { variations as variationsTable } from "@/lib/db/schema/variations";
import { OrderItem } from "../../db/schema/orderItems";
import { eq, sql } from "drizzle-orm";
import { findSomeProductOutOfStock } from "../../utils";

export const updateStock = async (trx: any, orderDetails: OrderItem[]) => {
  try {
    for (const item of orderDetails) {
      const productData = await trx.query.products.findFirst({
        where: eq(productsTable.id, item.productId),
        with: {
          variations: {
            with: {
              nestedVariations: true,
            },
          },
          productImages: true,
        },
      });

      if (productData?.variationType === "NESTED_VARIATION") {
        await trx
          .update(nestedVariationsTable)
          .set({
            stock: sql`
              CASE
                WHEN ${nestedVariationsTable.stock} - ${item.quantity} <= 0
                THEN 0
                ELSE ${nestedVariationsTable.stock} - ${item.quantity}
              END
            `,
          })
          .where(eq(nestedVariationsTable.id, item.nestedVariationId!));
      } else if (productData?.variationType === "VARIATION") {
        await trx
          .update(variationsTable)
          .set({
            stock: sql`
              CASE
                WHEN ${variationsTable.stock} - ${item.quantity} <= 0
                THEN 0
                ELSE ${variationsTable.stock} - ${item.quantity}
              END
            `,
          })
          .where(eq(variationsTable.id, item.variationId!));
      } else {
        await trx
          .update(productsTable)
          .set({
            stock: sql`
              CASE
                WHEN ${productsTable.stock} - ${item.quantity} <= 0
                THEN 0
                ELSE ${productsTable.stock} - ${item.quantity}
              END
            `,
          })
          .where(eq(productsTable.id, item.productId!));
      }
    }

    for (const item of orderDetails) {
      const productData = await trx.query.products.findFirst({
        where: eq(productsTable.id, item.productId),
        with: {
          variations: {
            with: {
              nestedVariations: true,
            },
          },
          productImages: true,
        },
      });
      const isSomeProductOutOfStock = findSomeProductOutOfStock(productData);

      if (isSomeProductOutOfStock) {
        await trx
          .update(productsTable)
          .set({
            outOfStock: true,
          })
          .where(eq(productsTable.id, item.productId!));
      }
    }
  } catch (error) {
    console.log("updateStock", error);
    throw new Error("Failed update");
  }
};
