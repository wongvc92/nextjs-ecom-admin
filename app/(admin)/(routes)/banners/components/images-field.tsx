"use client";

import { Crop, ImagePlusIcon, Move, RectangleHorizontal } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "../../products/components/form/form-field-wrapper";
import Spinner from "@/components/spinner";
import { useImageManager } from "@/hooks/useImageManager";
import { ImageCropProvider } from "@/providers/image-crop-provider";
import { TBannerImageFormSchema } from "@/lib/validation/bannerImagesValidation";
import { toast } from "sonner";
import ImagePlaceholder from "./image-placeholder";
import { v4 as uuidv4 } from "uuid";
import FieldError from "../../products/components/form/field-error";

const ImagesField = () => {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext<TBannerImageFormSchema>();

  const [previewImage, setPreviewImage] = useState({ id: getValues("id"), url: getValues("url") });
  const [isPending, startTransition] = useTransition();
  const hiddenFileRef = useRef<HTMLInputElement | null>(null);
  const { uploadSingleImage } = useImageManager();

  const toggleAddImage = () => {
    if (hiddenFileRef.current) {
      hiddenFileRef.current.click();
    }
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    startTransition(async () => {
      if (e.target.files) {
        const filesToUpload = e.target.files[0];
        const uploadedImage = await uploadSingleImage(filesToUpload);
        if (!uploadedImage) return;
        setValue("url", uploadedImage);
        setPreviewImage({ id: uuidv4(), url: uploadedImage });
        if (hiddenFileRef.current) {
          hiddenFileRef.current.value = "";
        }
      }
    });
  };

  return (
    <FormFieldWrapper>
      <input hidden {...register("url" as const)} ref={hiddenFileRef} multiple type="file" id="url" className="w-full" onChange={handleAddImages} />
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

        <ImageCropProvider>
          <ImagePlaceholder id={previewImage.id} url={previewImage.url} setPreviewImage={setPreviewImage} />
        </ImageCropProvider>

        <div
          onClick={toggleAddImage}
          className={`flex flex-col items-center justify-center border border-dashed p-2 rounded-md cursor-pointer max-h-[400px] w-full aspect-video ${
            previewImage.url ? "hidden" : "block"
          }`}
        >
          {isPending ? <Spinner /> : <ImagePlusIcon className=" text-orange-500" />}
          <span className="text-sm  text-orange-500">Add Image</span>
        </div>

        {errors?.url && <FieldError error={errors.url.message} />}
      </div>
    </FormFieldWrapper>
  );
};
export default ImagesField;
