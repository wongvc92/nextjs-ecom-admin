import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { Shipping, shippings } from "./shippings";
import { OrderItem, orderItems } from "./orderItems";

export const orders = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: text("customer_id"),
  amountInCents: integer("amount_in_cents").notNull(),
  productName: varchar("product_name").notNull(),
  image: varchar("image"),
  status: varchar("status").notNull(),
  trackingNumber: varchar("tracking_number"),
  courierName: varchar("courier_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Order = InferSelectModel<typeof orders> & {
  orderItems: OrderItem[];
  shippings: Shipping[];
};

export const ordersRelations = relations(orders, ({ many }) => ({
  shippings: many(shippings),
  orderItems: many(orderItems),
}));
