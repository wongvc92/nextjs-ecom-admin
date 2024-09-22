import { NextResponse } from "next/server";
import { getDistinctSizes } from "@/lib/db/queries/store/filters";

export async function GET(req: Request) {
  try {
    const { sizeNestedVariations, sizeVariations } = await getDistinctSizes();
    const distinctSizeVariationsNames = sizeVariations.map((item) => item.name);
    const distinctSizeNestedVariationsNames = sizeNestedVariations.map((item) => item.name);

    const sizeNames = [...distinctSizeVariationsNames, ...distinctSizeNestedVariationsNames];

    return NextResponse.json({ sizeNames }, { status: 200 });
  } catch (error) {
    console.error("[Failed fetch variations]:", error);
    return NextResponse.json("[Failed fetch variations]", { status: 500 });
  }
}
