import { getBannerImages } from "@/lib/db/queries/store/bannerImages";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bannerImages = await getBannerImages();

    return NextResponse.json({ bannerImages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error. Failed fetch banner images" }, { status: 500 });
  }
}
