export const revalidateStore = async (urlPaths: string[]) => {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_STORE_URL}/api/revalidate?secret=${encodeURIComponent(process.env.NEXT_PUBLIC_REVALIDATE_SECRET!)}${urlPaths
        .map((path) => `&path=${encodeURIComponent(path)}`)
        .join("")}`,
      {
        method: "POST",
      }
    );
    return {
      success: "Store paths revalidate",
    };
  } catch (error) {
    throw new Error("Failed revalidate store paths");
  }
};
