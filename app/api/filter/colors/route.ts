import { NextResponse } from "next/server";
import { getDistinctColors } from "@/lib/db/queries/store/filters";

export async function GET(req: Request) {
  try {
    const { colorNestedVariations, colorVariations } = await getDistinctColors();

    const distinctColorVariationsNames = colorVariations.map((item) => item.name);
    const distinctColorNestedVariationsNames = colorNestedVariations.map((item) => item.name);

    const colorNames = [...distinctColorVariationsNames, ...distinctColorNestedVariationsNames];

    return NextResponse.json({ colorNames }, { status: 200 });
  } catch (error) {
    console.error("[Failed fetch variations]:", error);
    return NextResponse.json("[Failed fetch variations]", { status: 500 });
  }
}
