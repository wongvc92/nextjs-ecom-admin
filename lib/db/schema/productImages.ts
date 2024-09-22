import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "./products";
import { InferSelectModel, relations } from "drizzle-orm";

export const productImages = pgTable("productImage", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url").notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export type ProductImage = InferSelectModel<typeof productImages>;
