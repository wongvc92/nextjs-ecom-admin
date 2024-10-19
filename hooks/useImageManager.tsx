"use client";

import { getSignedURL } from "@/actions/images";
import { allowedFileSize } from "@/lib/constant";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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

export const validateMultipleImages = (filesToUpload: File[], existingImages: Image[]) => {
  if (!Array.isArray(filesToUpload) || !Array.isArray(existingImages)) return;

  const totalFiles = existingImages.length + filesToUpload.length;
  // Check if the total number of files exceeds 9
  if (totalFiles > 9) {
    toast.error("Maximum 9 files allowed");
    return;
  }
  const remainingSlots = 9 - existingImages.length;
  const filesToAppend = filesToUpload.slice(0, remainingSlots);

  if (!filesToAppend.every((file) => file.type.startsWith("image"))) {
    toast.error(`Failed to upload image, make sure upload image only`);
    return null;
  } else if (filesToAppend.some((file) => file.size >= allowedFileSize)) {
    toast.error(`Failed to upload image, max size 1Mb only`);
    return null;
  }
  return filesToAppend;
};

export const validateSingleImage = (fileToUpload: File) => {
  if (!fileToUpload.type.startsWith("image")) {
    toast.error(`Failed to upload image, make sure upload image only`);
    return null;
  } else if (fileToUpload.size >= allowedFileSize) {
    toast.error(`Failed to upload image, max size 1Mb only`);
    return null;
  }
  return fileToUpload;
};

export const useImageManager = () => {
  const uploadMultipleImages = async (filesToUpload: File[], existingImages: Image[]) => {
    const filesToAppend = validateMultipleImages(filesToUpload, existingImages);

    if (!filesToAppend) return;

    const uploadedImages: Image[] = [];

    for (const file of filesToAppend) {
      const checksum = await computeSHA256(file);

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
    const fileToUpload = validateSingleImage(file);
    if (!fileToUpload) return;
    const checksum = await computeSHA256(fileToUpload);

    const formData = new FormData();
    formData.append("size", fileToUpload.size.toString());
    formData.append("type", fileToUpload.type);
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
        "Content-Type": fileToUpload.type,
      },
      body: fileToUpload,
    });

    const fileUrl = signedUrl?.split("?")[0];

    // Return the updated images array
    return fileUrl;
  };

  return { uploadMultipleImages, uploadSingleImage };
};
