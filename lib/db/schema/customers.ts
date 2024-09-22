import { boolean, timestamp, pgTable, text, primaryKey, integer, pgEnum, uuid } from "drizzle-orm/pg-core";

// import type { AdapterAccountType } from "next-auth/adapters";
import { InferSelectModel, relations } from "drizzle-orm";
import { shippings } from "./shippings";
import { orders } from "./orders";

export const customers = pgTable("customer", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Customer = InferSelectModel<typeof customers>;
