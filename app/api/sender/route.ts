import { getDefaultSender } from "@/lib/db/queries/store/senders";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const senderData = await getDefaultSender();
    return NextResponse.json(senderData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};
