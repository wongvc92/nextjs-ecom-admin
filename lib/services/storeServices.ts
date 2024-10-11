import "server-only";
const baseUrl = process.env.NEXT_PUBLIC_STORE_URL!;
const secret = process.env.REVALIDATE_SECRET!;

export const revalidateStore = async (urlPaths: string[]) => {
  const url = new URL(`${baseUrl}/api/revalidate`);

  try {
    await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ urlPaths, secret }),
    });

    return {
      success: "Store paths revalidate",
    };
  } catch (error) {
    throw new Error("Failed revalidate store paths");
  }
};

export const revalidateTagStore = async (tags: string[]) => {
  const url = new URL(`${baseUrl}/api/revalidateTagStore`);

  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secret,
        tags: tags,
      }),
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
