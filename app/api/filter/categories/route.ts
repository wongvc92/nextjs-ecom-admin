import { NextResponse } from "next/server";

import { getDistinctCategories } from "@/lib/db/queries/admin/categories";

export async function GET(req: Request) {
  try {
    const result = await getDistinctCategories();
    const distinctCategories = result.map((item) => item.name);

    return NextResponse.json({ categories: distinctCategories }, { status: 200 });
  } catch (error) {
    console.error("[Failed fetch variations]:", error);
    return NextResponse.json("[Failed fetch variations]", { status: 500 });
  }
}
