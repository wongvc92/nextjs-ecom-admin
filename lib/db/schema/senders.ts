import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";

export const senders = pgTable("senders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  dialing_country_code: varchar("dialing_country_code", { length: 2 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  address_1: text("address_1").notNull(),
  address_2: text("address_2"),
  postcode: varchar("postcode", { length: 5 }).notNull(),
  province: varchar("province", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  country: varchar("country", { length: 2 }).notNull(),
});

export type Sender = InferSelectModel<typeof senders>;
