import { unstable_cache } from "next/cache";
import { db } from "../..";
import { Sender, senders as sendersTable } from "../../schema/senders";
import { eq } from "drizzle-orm";

export const getDefaultSender = unstable_cache(
  async (): Promise<Sender | null> => {
    const [senderData] = await db.select().from(sendersTable).where(eq(sendersTable.defaultSender, true));
    if (!senderData) return null;
    return senderData;
  },
  ["senders"],
  { tags: ["senders"] }
);
