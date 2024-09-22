"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Slider } from "@/components/ui/slider";
import { useImageManager } from "@/hooks/useImageManager";
import { Dispatch, SetStateAction, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import Cropper from "./cropper";
import { useImageCropContext } from "@/providers/image-crop-provider";
import { deleteBanner } from "@/actions/banner";
import { TBannerImagesFormSchema } from "@/lib/validation/bannerImagesValidation";

interface Image {
  id: string;
  url: string;
}

interface CropImageProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setPreviewImages: Dispatch<SetStateAction<Image[]>>;
}
const CropImageModal: React.FC<CropImageProps> = ({ setIsOpen, isOpen, setPreviewImages }) => {
  const [isPending, startTransition] = useTransition();
  const { setValue, getValues } = useFormContext<TBannerImagesFormSchema>(); // retrieve all hook methods
  const { uploadSingleImage } = useImageManager();
  const { getProcessedImage, setImage, resetStates, zoom, setZoom, rotation, setRotation, imageToDelete } = useImageCropContext();

  const handleCropImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const file = await getProcessedImage();
      if (!file) return;
      const fileToUrl = (await uploadSingleImage(file)) as string;
      await deleteBanner(imageToDelete as string);
      const newImages = getValues("bannerImages").filter((item) => item.url !== imageToDelete);
      const updatedImages = [...newImages, { id: uuidv4(), url: fileToUrl }];
      setValue("bannerImages", updatedImages);
      setPreviewImages(updatedImages);
      resetStates();
      setIsOpen(false);
    });
  };

  return (
    <Modal title="Edit image" description="Edit Image" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="space-y-6">
        <div className="aspect-square relative flex flex-col">
          <Cropper />
        </div>
        <div className="space-y-2">
          <p>Zoom: {zoom}</p>
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
          <Button type="button" onClick={handleCropImage} className="flex items-center gap-2" disabled={isPending}>
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

export default CropImageModal;
