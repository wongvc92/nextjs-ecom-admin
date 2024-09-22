import { eq } from "drizzle-orm";
import { db } from "../db";
import { galleries as galleriesTable } from "@/lib/db/schema/galleries";

export const createGalleryImageDB = async (url: string) => {
  try {
    await db.insert(galleriesTable).values({
      url,
    });
  } catch (error) {
    throw new Error("Failed create gallery image");
  }
};
export const deleteGalleryImage = async (url: string) => {
  try {
    await db.delete(galleriesTable).where(eq(galleriesTable.url, url));
  } catch (error) {
    throw new Error("Failed delete gallery image");
  }
};

export const deleteGalleryImageByUrl = async (url: string, tx: any) => {
  try {
    await tx.delete(galleriesTable).where(eq(galleriesTable.url, url));
  } catch (error) {
    throw new Error("Failed update gallery status");
  }
};
