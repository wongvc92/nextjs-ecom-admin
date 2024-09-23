"use client";

import { Crop, ImagePlusIcon, Move, RectangleHorizontal } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "../../products/components/form/form-field-wrapper";
import Spinner from "@/components/spinner";
import FieldError from "../../products/components/form/field-error";
import SortableImage from "./sortable-image";
import { useImageManager } from "@/hooks/useImageManager";
import { useDragAndDrop } from "@/hooks/useDrapAndDrop";
import { ImageCropProvider } from "@/providers/image-crop-provider";
import { DragEndEvent } from "@dnd-kit/core";
import { TBannerImagesFormSchema } from "@/lib/validation/bannerImagesValidation";

interface Image {
  id: string;
  url: string;
}

const ImagesField = () => {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<TBannerImagesFormSchema>();

  const [previewImages, setPreviewImages] = useState<Image[]>(watch("bannerImages") ?? []);
  const [isPending, startTransition] = useTransition();
  const hiddenFileRef = useRef<HTMLInputElement | null>(null);
  const { uploadMultipleImages } = useImageManager();
  const { SortableContext, closestCenter, handleDragEnd, horizontalListSortingStrategy, sensors, DndContext } = useDragAndDrop(
    previewImages,
    setPreviewImages
  );

  const toggleAddImage = () => {
    if (hiddenFileRef.current) {
      hiddenFileRef.current.click();
    }
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    startTransition(async () => {
      if (e.target.files) {
        const filesToUpload = Array.from(e.target.files);
        const uploadedImages = await uploadMultipleImages(filesToUpload, getValues("bannerImages"));
        setValue("bannerImages", uploadedImages as Image[]);
        setPreviewImages(uploadedImages as Image[]);
        if (hiddenFileRef.current) {
          hiddenFileRef.current.value = "";
        }
      }
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    if (!e) return;
    const sortedImages = handleDragEnd(e);
    setValue("bannerImages", sortedImages as Image[]);
  };

  return (
    <FormFieldWrapper>
      <input
        hidden
        {...register("bannerImages" as const)}
        ref={hiddenFileRef}
        multiple
        type="file"
        id="banner"
        className="w-full"
        onChange={handleAddImages}
      />
      <div className="flex flex-col w-full gap-2 space-y-8">
        <ul className="text-xs text-muted-foreground space-y-2">
          <li className="flex items-center gap-2">
            <RectangleHorizontal className="text-orange-500 w-4 h-4" /> Best size is 1200 x 400 pixels
          </li>
          <li className="flex items-center gap-2">
            <Move className="text-orange-500 w-4 h-4" />
            Drag to reposition the banner
          </li>
          <li className="flex items-center gap-2">
            <Crop className="text-red-500 w-4 h-4" /> Please use crop image function to resize your banner image
          </li>
        </ul>
        <div className="grid grid-cols-2 md:grid-cols-3   gap-4 w-full ">
          <ImageCropProvider>
            <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter} sensors={sensors}>
              <SortableContext items={previewImages} strategy={horizontalListSortingStrategy}>
                {previewImages.map((image) => (
                  <SortableImage key={image.id} id={image.id} url={image.url} setPreviewImages={setPreviewImages} />
                ))}
              </SortableContext>
            </DndContext>
          </ImageCropProvider>
          {previewImages.length < 9 ? (
            <div
              onClick={toggleAddImage}
              className="flex flex-col items-center justify-center border border-dashed p-2 rounded-md cursor-pointer max-h-[400px] w-full aspect-video "
            >
              {isPending ? <Spinner /> : <ImagePlusIcon className=" text-orange-500" />}
              <span className="text-sm  text-orange-500">Add Image</span>
              <span className="text-sm  text-orange-500">({previewImages.length}/9)</span>
            </div>
          ) : (
            ""
          )}
        </div>

        {errors?.bannerImages && <FieldError error={errors.bannerImages.message} />}
      </div>
    </FormFieldWrapper>
  );
};
export default ImagesField;