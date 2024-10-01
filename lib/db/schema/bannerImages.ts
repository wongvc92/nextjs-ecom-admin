import { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const bannerImages = pgTable("bannerImage", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BannerImage = InferSelectModel<typeof bannerImages>;
