import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { InferSelectModel, relations } from "drizzle-orm";

export const orderStatusHistories = pgTable("orderStatusHistory", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  status: varchar("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type OrderStatusHistory = InferSelectModel<typeof orderStatusHistories>;

export const orderStatusHistoriesRelations = relations(orderStatusHistories, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistories.orderId],
    references: [orders.id],
  }),
}));
