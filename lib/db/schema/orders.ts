import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { Shipping, shippings } from "./shippings";
import { OrderItem, orderItems } from "./orderItems";
import { orderStatusHistories } from "./orderStatusHistories";

export const orderStatusEnum = pgEnum("status", ["cancelled", "pending", "paid", "to_ship", "shipped", "completed"]);

export const orders = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: text("customer_id"),
  subtotalInCents: integer("subtotalInCents").notNull(),
  totalShippingInCents: integer("totalShippingsInCents").notNull(),
  courierServiceId: integer("courierServiceId").notNull(),
  amountInCents: integer("amount_in_cents").notNull(),
  totalWeightInGram: integer("totalWeightInGram").notNull(),
  productName: varchar("product_name").notNull(),
  image: varchar("image"),
  status: orderStatusEnum("status").notNull().default("pending"),
  trackingNumber: varchar("tracking_number"),
  shippingOrderNumber: varchar("shippingOrderNumber"),
  courierName: varchar("courier_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Order = InferSelectModel<typeof orders> & {
  orderItems: OrderItem[];
  shippings: Shipping[];
};

export type OrderStatusEnumType = (typeof orderStatusEnum.enumValues)[number];

export const ordersRelations = relations(orders, ({ many }) => ({
  shippings: many(shippings),
  orderItems: many(orderItems),
  orderStatusHistories: many(orderStatusHistories),
}));
