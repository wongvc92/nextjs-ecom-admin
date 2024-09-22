import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "./products";
import { NestedVariation, nestedVariations } from "./nestedVariations";
import { InferSelectModel, relations } from "drizzle-orm";

export const variations = pgTable("variation", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label"),
  name: varchar("name"),
  priceInCents: integer("price_in_cents"),
  stock: integer("stock"),
  sku: varchar("sku"),
  image: varchar("image"),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Variation = InferSelectModel<typeof variations> & {
  nestedVariations?: NestedVariation[];
};

export const variationsRelations = relations(variations, ({ one, many }) => ({
  product: one(products, {
    fields: [variations.productId],
    references: [products.id],
  }),
  nestedVariations: many(nestedVariations),
}));
