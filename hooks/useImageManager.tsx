"use client";

import { getSignedURL } from "@/actions/images";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
const allowedFileTypes = ["image/jpeg", "image/png"];

export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

interface Image {
  id: string;
  url: string;
}
export const useImageManager = () => {
  const uploadMultipleImages = async (filesToUpload: File[], existingImages: Image[]) => {
    const totalFiles = existingImages.length + filesToUpload.length;
    // Check if the total number of files exceeds 9
    if (totalFiles > 9) {
      toast.error("Maximum 9 files allowed");
      return;
    }
    const remainingSlots = 9 - existingImages.length;
    const filesToAppend = filesToUpload.slice(0, remainingSlots);

    const uploadedImages: Image[] = [];
    for (const file of filesToAppend) {
      const checksum = await computeSHA256(file);
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(`Failed to upload image, make sure upload ${allowedFileTypes} format`);
        return;
      }

      const formData = new FormData();
      formData.append("size", file.size.toString());
      formData.append("type", file.type);
      formData.append("checksum", checksum);
      const res = await getSignedURL(formData);

      if (res.error || !res.success) {
        toast.error(res.error);
        return;
      }
      const signedUrl = res.success.url;
      await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      const fileUrl = signedUrl?.split("?")[0];
      uploadedImages.push({ id: uuidv4().toString(), url: fileUrl });
    }

    // Return the updated images array
    return [...existingImages, ...uploadedImages];
  };

  const uploadSingleImage = async (file: File) => {
    const checksum = await computeSHA256(file);
    if (!allowedFileTypes.includes(file.type)) {
      toast.error(`Failed to upload image, make sure upload ${allowedFileTypes} format`);
      return "";
    }

    const formData = new FormData();
    formData.append("size", file.size.toString());
    formData.append("type", file.type);
    formData.append("checksum", checksum);
    const res = await getSignedURL(formData);

    if (res.error || !res.success) {
      toast.error(res.error);
      return "";
    }
    const signedUrl = res.success.url;
    await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    const fileUrl = signedUrl?.split("?")[0];

    // Return the updated images array
    return fileUrl;
  };

  return { uploadMultipleImages, uploadSingleImage };
};
