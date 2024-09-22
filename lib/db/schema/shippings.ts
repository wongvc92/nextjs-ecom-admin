import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { InferSelectModel, relations } from "drizzle-orm";

export const shippings = pgTable("shipping", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: varchar("address").notNull(),
  address2: varchar("address2"),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  postalCode: varchar("postal_code").notNull(),
  country: varchar("country"),
  name: varchar("name").notNull(),
  phone: varchar("phone"),
  email: varchar("email"),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  customerId: text("customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Shipping = InferSelectModel<typeof shippings>;

export const shippingRelations = relations(shippings, ({ one }) => ({
  order: one(orders, {
    fields: [shippings.orderId],
    references: [orders.id],
  }),
}));
