import { count, desc, eq } from "drizzle-orm";
import { db } from "../..";
import { Sender, senders as sendersTable } from "../../schema/senders";
import { unstable_cache } from "next/cache";

export const getSenders = unstable_cache(
  async (): Promise<Sender[] | null> => {
    const sender = await db.select().from(sendersTable).orderBy(desc(sendersTable.updatedAt));
    if (!sender) return null;
    return sender;
  },
  ["senders"],
  { tags: ["senders"] }
);

export const getSenderCount = unstable_cache(
  async (): Promise<number> => {
    const [sender] = await db.select({ count: count() }).from(sendersTable);
    if (!sender) return 0;
    return sender.count;
  },
  ["senders"],
  { tags: ["senders"] }
);

export const getSenderById = async (id: string): Promise<Sender | null> => {
  const [sender] = await db.select().from(sendersTable).where(eq(sendersTable.id, id));
  if (!sender) return null;
  return sender;
};

export const getDefaultSender = unstable_cache(
  async (): Promise<Sender | null> => {
    const [senderData] = await db.select().from(sendersTable).where(eq(sendersTable.defaultSender, true));
    if (!senderData) return null;
    return senderData;
  },
  ["senders"],
  { tags: ["senders"] }
);
