import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const orderItems = pgTable("orderItem", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  productId: varchar("product_id").notNull(),
  productName: varchar("product_name").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  image: varchar("image"),
  quantity: integer("quantity").notNull(),
  variationId: varchar("variation_id"),
  variationLabel: varchar("variation_label"),
  variationName: varchar("variation_name"),
  nestedVariationId: varchar("nested_variation_id"),
  nestedVariationLabel: varchar("nested_variation_label"),
  nestedVariationName: varchar("nested_variation_name"),
  shippingFeeInCents: integer("shipping_fee_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type OrderItem = InferSelectModel<typeof orderItems>;

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
