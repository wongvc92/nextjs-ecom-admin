import { InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const galleries = pgTable("gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url").notNull(),
  productId: uuid("product_id"),
  variationId: uuid("variation_id"),
  bannerImageId: uuid("bannerImage_id"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Gallery = InferSelectModel<typeof galleries>;
