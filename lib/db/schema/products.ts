import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { Variation, variations } from "./variations";
import { ProductImage, productImages } from "./productImages";
import { InferSelectModel, relations } from "drizzle-orm";

export const products = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  isArchived: boolean("is_archived").default(false),
  isFeatured: boolean("is_featured").default(false),
  variationType: varchar("variation_type").notNull(),
  priceInCents: integer("price_in_cents"),
  stock: integer("stock"),
  minPurchase: integer("min_purchase").notNull(),
  maxPurchase: integer("max_purchase").notNull(),
  weightInGram: integer("weight_in_gram").notNull(),
  shippingFeeInCents: integer("shipping_fee_in_cents").notNull(),
  tags: text("tags").array().$type<string[]>(),
  category: varchar("category").notNull(),
  availableVariations: text("available_variations").array().$type<string[]>(),
  lowestPriceInCents: integer("lowest_price").notNull(),
  isOutOfStock: boolean("is_out_of_stock").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Product = InferSelectModel<typeof products> & {
  variations?: Variation[];
  productImages: ProductImage[];
};

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  productImages: many(productImages),
  variations: many(variations),
}));
