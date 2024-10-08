"use client";

import React, { Dispatch, SetStateAction, useState, useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CropIcon, Move, X } from "lucide-react";
import Image from "next/image";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useImageCropContext } from "@/providers/image-crop-provider";
import { readFile } from "@/lib/cropImage";
import CropImageModal from "./crop-image-modal";
import { deleteProductImage } from "@/actions/product";
import { TProductSchema } from "@/lib/validation/productValidation";
import { urlToFile } from "@/lib/utils";

interface Image {
  id: string;
  url: string;
}

interface SortableItemProps {
  url: string;
  id: string;
  setPreviewImages: Dispatch<SetStateAction<Image[]>>;
}

const SortableImage: React.FC<SortableItemProps> = ({ url, id, setPreviewImages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setValue, getValues } = useFormContext<TProductSchema>(); // retrieve all hook method
  const [isPending, startTransition] = useTransition();
  // Initialize the sortable hook
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { setImage, setImageToDelete } = useImageCropContext();
  // Apply CSS transformations and transitions
  const style = {
    transform: CSS.Transform.toString(transform), // Transform must be converted to a string
    transition, // Ensure transition property is applied for animations
  };

  const handleDeleteImage = () => {
    startTransition(async () => {
      const existingImage = getValues("productImages");
      if (existingImage.length === 1) {
        toast.error("at least 1 image is required");
        return;
      }
      const res = await deleteProductImage(url);

      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
        const newImages = getValues("productImages").filter((image) => image.url !== url);
        setPreviewImages(newImages);
        setValue("productImages", newImages);
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
    <div
      ref={setNodeRef} // Attach sortable node reference
      {...listeners} // Apply event listeners for dragging
      {...attributes} // Apply draggable attributes
      style={style} // Apply the calculated styles
      className="relative rounded-md overflow-hidden max-h-[200px] max-w-[200px] aspect-square group touch-none "
    >
      <CropImageModal isOpen={isOpen} setIsOpen={setIsOpen} setPreviewImages={setPreviewImages} />
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

export default SortableImage;
