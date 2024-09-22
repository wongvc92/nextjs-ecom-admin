import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { variations } from "./variations";
import { InferSelectModel, relations } from "drizzle-orm";

export const nestedVariations = pgTable("nestedVariation", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label"),
  name: varchar("name"),
  priceInCents: integer("price_in_cents"),
  stock: integer("stock"),
  sku: varchar("sku"),
  variationId: uuid("variation_id")
    .notNull()
    .references(() => variations.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type NestedVariation = InferSelectModel<typeof nestedVariations>;

export const nestedVariationsRelations = relations(nestedVariations, ({ one }) => ({
  variations: one(variations, {
    fields: [nestedVariations.variationId],
    references: [variations.id],
  }),
}));
