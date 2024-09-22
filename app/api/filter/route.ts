import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { variations as variationsTable } from "@/lib/db/schema/variations";
import { nestedVariations as nestedVariationsTable } from "@/lib/db/schema/nestedVariations";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const sizeVariations = await db
      .selectDistinct({ name: variationsTable.name })
      .from(variationsTable)
      .where(or(eq(variationsTable.label, "size"), eq(variationsTable.label, "sizes")));

    const sizeNestedVariations = await db
      .selectDistinct({ name: nestedVariationsTable.name })
      .from(nestedVariationsTable)
      .where(or(eq(nestedVariationsTable.label, "size"), eq(nestedVariationsTable.label, "sizes")));

    const distinctSizeVariationsNames = sizeVariations.map((item) => item.name);
    const distinctSizeNestedVariationsNames = sizeNestedVariations.map((item) => item.name);

    const sizeNames = [...distinctSizeVariationsNames, ...distinctSizeNestedVariationsNames];

    return NextResponse.json({ sizeNames }, { status: 200 });
  } catch (error) {
    console.error("[Failed fetch variations]:", error);
    return NextResponse.json("[Failed fetch variations]", { status: 500 });
  }
}
