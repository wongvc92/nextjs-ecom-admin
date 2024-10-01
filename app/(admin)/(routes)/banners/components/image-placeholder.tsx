"use client";

import React, { Dispatch, SetStateAction, useState, useTransition } from "react";
import { CropIcon, Move, X } from "lucide-react";
import Image from "next/image";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { deleteBanner } from "@/actions/banner";
import { toast } from "sonner";
import { useImageCropContext } from "@/providers/image-crop-provider";
import { readFile } from "@/lib/cropImage";
import CropImageModal from "./crop-image-modal";
import { TBannerImageFormSchema } from "@/lib/validation/bannerImagesValidation";
import { urlToFile } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Image {
  id: string;
  url: string;
}

interface SortableItemProps {
  url: string;
  id: string;
  setPreviewImage: Dispatch<SetStateAction<Image>>;
}

const ImagePlaceholder: React.FC<SortableItemProps> = ({ url, id, setPreviewImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { setValue, getValues } = useFormContext<TBannerImageFormSchema>();
  const [isPending, startTransition] = useTransition();

  const { setImage, setImageToDelete } = useImageCropContext();

  const handleDeleteImage = () => {
    startTransition(async () => {
      const res = await deleteBanner(url);

      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
        router.push("/banners");
      }
    });
  };

  const handleOpenModal = async () => {
    setIsOpen(true);
    const fileToCrop = await urlToFile(url, "image-file.png", "image/png");
    const imageDataUrl = (await readFile(fileToCrop)) as string;
    setImage(imageDataUrl);
    setImageToDelete(url);
  };
  return (
    <div className={`relative rounded-md overflow-hidden max-w-lg aspect-video ${url ? "block" : "hidden"}`}>
      <CropImageModal isOpen={isOpen} setIsOpen={setIsOpen} setPreviewImage={setPreviewImage} />
      <Image
        src={url}
        alt="image"
        fill
        className="object-cover cursor-move group-hover:scale-110 transition"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />

      <Button size="icon" variant="ghost" type="button" className="absolute top-1 left-1 bg-white p-1 rounded-sm opacity-90 z-10 md:hidden">
        <Move className="text-orange-500 w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        type="button"
        className="absolute rounded-sm opacity-90  bg-white top-1 right-1 z-20"
        onClick={handleDeleteImage}
      >
        {isPending ? <Spinner className="w-4 h-4" /> : <X className="text-red-500" />}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        type="button"
        className="absolute p-1 rounded-sm opacity-90 bg-white bottom-1 right-1 z-20"
        onClick={handleOpenModal}
      >
        <CropIcon className="text-red-500 w-4 h-4" />
      </Button>
    </div>
  );
};

export default ImagePlaceholder;
