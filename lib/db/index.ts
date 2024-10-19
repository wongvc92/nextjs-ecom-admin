import pg from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

import * as bannerImages from "./schema/bannerImages";
import * as categories from "./schema/categories";
import * as galleries from "./schema/galleries";
import * as variations from "./schema/variations";
import * as nestedVariations from "./schema/nestedVariations";
import * as orders from "./schema/orders";
import * as orderItems from "./schema/orderItems";
import * as products from "./schema/products";
import * as shippings from "./schema/shippings";
import * as users from "./schema/users";
import * as productImages from "./schema/productImages";
import * as customers from "./schema/customers";
import * as senders from "./schema/senders";
import * as orderStatusHistories from "./schema/orderStatusHistories";

export const schema = {
  ...orderStatusHistories,
  ...bannerImages,
  ...categories,
  ...galleries,
  ...variations,
  ...nestedVariations,
  ...orders,
  ...orderItems,
  ...products,
  ...shippings,
  ...users,
  ...productImages,
  ...customers,
  ...senders,
};
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
export type Transaction = ReturnType<(typeof db)["transaction"]>;
