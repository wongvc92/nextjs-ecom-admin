"use client";

import Modal from "@/components/ui/modal";
import React, { Dispatch, SetStateAction, useTransition } from "react";
import { UseFieldArrayUpdate, useFormContext } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import { toast } from "sonner";
import { deleteVariationImage } from "@/actions/product";
import { useImageCropContext } from "@/providers/image-crop-provider";
import { useImageManager } from "@/hooks/useImageManager";
import Cropper from "./cropper";
import { TProductSchema } from "@/lib/validation/productValidation";

interface ICropVariationImage {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  update: UseFieldArrayUpdate<TProductSchema>;
  previewUrls: string[];
  setPreviewUrls: Dispatch<SetStateAction<string[]>>;
  variationIndex: number;
}

const CropVariationImageModal: React.FC<ICropVariationImage> = ({ setIsOpen, isOpen, previewUrls, setPreviewUrls, variationIndex }) => {
  const [isPending, startTransition] = useTransition();
  const { setValue } = useFormContext<TProductSchema>();
  const { getProcessedImage, setImage, resetStates, zoom, setZoom, rotation, setRotation, imageToDelete } = useImageCropContext();
  const { uploadSingleImage } = useImageManager();
  const zoomPercent = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  const cropImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    startTransition(async () => {
      e.preventDefault();
      const croppedFile = (await getProcessedImage()) as File;

      const deleteRes = await deleteVariationImage(imageToDelete as string);
      if (deleteRes.error) {
        toast.error(deleteRes.error);
        return;
      }
      const fileUrl = await uploadSingleImage(croppedFile);
      if (!fileUrl || fileUrl === "") return;
      const images = [...previewUrls];
      images.splice(variationIndex, 1, fileUrl);
      setPreviewUrls(images);
      setValue(`variations.${variationIndex}.image`, fileUrl);
      resetStates();
      setIsOpen(false);
    });
  };

  return (
    <Modal title="Edit image" description="Edit Image" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="space-y-6">
        <div className="h-[300px] w-full">
          <Cropper aspect={1} />
        </div>
        <div className="space-y-2">
          <p>Zoom: {zoomPercent(zoom)}</p>
          <Slider min={1} max={3} step={0.1} value={[zoom]} onValueChange={(value) => setZoom(value[0])} />
        </div>
        <div className="space-y-2">
          <p>Rotation: {rotation + "°"}</p>
          <Slider min={0} max={360} step={0.1} value={[rotation]} onValueChange={(value) => setRotation(value[0])} />
        </div>
        <div className="flex items-center gap-4 justify-end">
          <Button type="button" onClick={() => setIsOpen(false)} variant="destructive">
            Cancel
          </Button>
          <Button type="button" onClick={cropImage} className="flex items-center gap-2" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner className="w-4 h-4" />
                Cropping...
              </>
            ) : (
              "Crop"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CropVariationImageModal;
