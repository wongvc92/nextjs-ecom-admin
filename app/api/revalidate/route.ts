import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const paths = searchParams.getAll("path");

  // Check for the secret to confirm this is a valid request
  if (secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  if (!paths) {
    return NextResponse.json({ message: "Please provide paths" }, { status: 401 });
  }
  try {
    // Revalidate the specified path
    await Promise.all(
      paths.map(async (path) => {
        revalidatePath(path);
      })
    );
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
