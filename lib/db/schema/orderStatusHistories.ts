import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { InferSelectModel, relations } from "drizzle-orm";

export const orderStatusEnum = pgEnum("status", ["cancelled", "pending", "to_ship", "shipped", "completed"]);

export const orderStatusHistories = pgTable("orderStatusHistory", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type OrderStatusHistory = InferSelectModel<typeof orderStatusHistories>;
export type OrderStatusEnumType = (typeof orderStatusEnum.enumValues)[number];

export const orderStatusHistoriesRelations = relations(orderStatusHistories, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistories.orderId],
    references: [orders.id],
  }),
}));
