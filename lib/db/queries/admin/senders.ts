import { eq } from "drizzle-orm";
import { db } from "../..";
import { Sender, senders as sendersTable } from "../../schema/senders";

export const getSenders = async (): Promise<Sender[] | null> => {
  const sender = await db.select().from(sendersTable);
  if (!sender) return null;
  return sender;
};
export const getSenderById = async (id: string): Promise<Sender | null> => {
  const [sender] = await db.select().from(sendersTable).where(eq(sendersTable.id, id));
  if (!sender) return null;
  return sender;
};
