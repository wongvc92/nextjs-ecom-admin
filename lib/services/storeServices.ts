export const revalidateStore = async (urlPaths: string[]) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_STORE_URL}/api/revalidate?secret=${encodeURIComponent(process.env.NEXT_PUBLIC_REVALIDATE_SECRET!)}${urlPaths
      .map((path) => `&path=${encodeURIComponent(path)}`)
      .join("")}`
  );

  try {
    await fetch(url.toString(), {
      method: "POST",
    });

    return {
      success: "Store paths revalidate",
    };
  } catch (error) {
    throw new Error("Failed revalidate store paths");
  }
};

export const revalidateTagStore = async (tags: string[]) => {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL!;
  const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET!;
  const url = new URL(`${baseUrl}/api/revalidateTagStore`);
  url.searchParams.set("secret", secret);
  tags.forEach((tag) => url.searchParams.append("tag", tag));

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
    });

    if (!res.ok) {
      console.error("Failed to revalidate store:", await res.text());
    }

    return {
      success: "Store paths revalidate",
    };
  } catch (error) {
    throw new Error("Failed revalidate store paths");
  }
};
