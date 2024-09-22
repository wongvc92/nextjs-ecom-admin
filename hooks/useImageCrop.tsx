"use client";

import React, { useState } from "react";
import { useImageManager } from "./useImageManager";
import getCroppedImg from "@/lib/cropImage";
import { toast } from "sonner";
import { deleteCropBanner } from "@/actions/banner";
import { v4 as uuidv4 } from "uuid";
import Cropper, { Area } from "react-easy-crop";
interface CropResult {
  file: File; // Adjust the type as per your actual Blob type
  url: string;
}

const allowedFileTypes = ["image/jpeg", "image/png"];
interface Image {
  id: string;
  url: string;
}
export const useImageCrop = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const { uploadSingleImage } = useImageManager();
  const cropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const zoomPercent = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };
  const cropImage = async (url: string) => {
    if (!croppedAreaPixels) return;

    if (!url) return;
    const { file } = (await getCroppedImg(url, croppedAreaPixels, rotation)) as CropResult;
    if (!file) {
      toast.error("Something went wrong, please try again or change new image");
      return;
    }

    const deleteRes = await deleteCropBanner(url);
    if (deleteRes.error) {
      toast.error(deleteRes.error);
      return;
    }

    const fileUrl = await uploadSingleImage(file);
    return fileUrl;
  };
  return { cropImage, crop, zoom, rotation, setZoom, setRotation, setCrop, cropComplete, zoomPercent, Cropper };
};
