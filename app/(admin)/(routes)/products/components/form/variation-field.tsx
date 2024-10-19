"use client";

import { Button } from "@/components/ui/button";
import { CropIcon, ImagePlusIcon, Plus, X } from "lucide-react";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import ApplyToAll from "./apply-to-all";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import NestedVariationField from "./nested-variation-field";
import { cn, urlToFile } from "@/lib/utils";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import VariationCheckbox from "./variation-checkbox";
import Spinner from "@/components/spinner";
import CropVariationImageModal from "./crop-variation-image-modal";
import VariationFieldError from "./variation-field-error";
import { toast } from "sonner";
import { deleteVariationImage } from "@/actions/product";
import { useImageManager } from "@/hooks/useImageManager";
import { useImageCropContext } from "@/providers/image-crop-provider";
import { readFile } from "@/lib/cropImage";
import { TProductSchema } from "@/lib/validation/productValidation";

interface VariationFieldProps {
  productsData?: TProductSchema;
}
const VariationField: React.FC<VariationFieldProps> = ({ productsData }) => {
  const {
    register,
    watch,
    control,
    setValue,
    getValues,

    formState: { errors },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods
  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
    update,
  } = useFieldArray({
    control,
    name: "variations", // Unique name for your Field Array
  });
  const variations = useWatch({
    control,
    name: "variations",
  });

  const initialPreviewUrls = variations?.map((variation) => variation.image) as string[];
  const hiddenFileInputs = useRef<(HTMLInputElement | null)[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialPreviewUrls || []);

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { uploadSingleImage } = useImageManager();
  const { setImageToDelete, setImage } = useImageCropContext();
  const watchVariationLabel = useWatch({
    control,
    name: "variations.0.label",
  });

  useEffect(() => {
    const checkAndToastErrors = () => {
      if (errors?.variations?.root?.message) {
        toast.error(errors?.variations?.root?.message);
      } else if (errors?.variations?.[0]?.nestedVariations?.root?.message) {
        toast.error(errors?.variations?.[0]?.nestedVariations?.root?.message);
      }
    };
    checkAndToastErrors();
  }, [errors]);

  const removeFieldArray = async (i: number) => {
    const imageToDelete = getValues(`variations.${i}.image`);
    if (imageToDelete) {
      const deleteRes = await deleteVariationImage(imageToDelete);
      if (deleteRes.error) {
        toast.error(deleteRes.error);
        return;
      }
      const updatedUrls = [...previewUrls];
      updatedUrls[i] = "";
      setPreviewUrls(updatedUrls);
    }

    removeVariation(i);
  };

  const deleteImage = async (i: number) => {
    startTransition(async () => {
      setValue(`variations.${i}.image`, "");
      const imageToDelete = previewUrls[i];
      if (!imageToDelete) return;
      const res = await deleteVariationImage(imageToDelete);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      const updatedUrls = [...previewUrls];
      updatedUrls.splice(i, 1, "");
      setPreviewUrls(updatedUrls);
    });
  };

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    startTransition(async () => {
      e.preventDefault();
      if (e.target.files) {
        const fileToUpload = e.target.files[0];
        const fileUrl = await uploadSingleImage(fileToUpload);
        if (!fileUrl || fileUrl === "") return;
        setValue(`variations.${i}.image`, fileUrl);
        const updatedUrls = [...previewUrls];
        updatedUrls[i] = fileUrl;
        setPreviewUrls(updatedUrls);
      }
    });
  };

  const toggleAddImage = (index: number) => {
    const fileInput = hiddenFileInputs.current[index];
    if (fileInput) {
      fileInput.click();
    }
  };

  const variationLength = watch("variations")?.length ?? 0;

  const handleOpenModal = async (i: number) => {
    setIsOpen(true);
    const imageToCrop = previewUrls[i];
    const fileToCrop = await urlToFile(imageToCrop, "image-file.png", "image/png");
    const imageDataUrl = (await readFile(fileToCrop)) as string;
    setImage(imageDataUrl);
    setImageToDelete(imageToCrop);
  };

  return (
    <FormFieldWrapper>
      <input hidden {...register("variationType")} />
      <FieldLabel htmlFor="variations">Variations</FieldLabel>

      <div className="flex flex-col space-y-6 w-full">
        <VariationCheckbox
          productsData={productsData}
          variationFields={variationFields}
          appendVariation={appendVariation}
          setPreviewUrls={setPreviewUrls}
        />
        {variationLength > 2 && (
          <div>
            <ApplyToAll productsData={productsData} />
          </div>
        )}

        {(watch("variationType") === "VARIATION" || watch("variationType") === "NESTED_VARIATION") && (
          <div className="flex flex-col gap-4 w-full ">
            {variationFields.map((item, variationIndex) => {
              return (
                <div className="flex flex-col gap-4  rounded-md p-2 bg-muted relative" key={item.id}>
                  <div className="flex justify-between">
                    {previewUrls[variationIndex] ? (
                      <div className="relative overflow-hidden rounded-md aspect-square w-[150px] cursor-pointer">
                        <Image src={previewUrls[variationIndex]} alt="image product" fill className="object-cover" />
                        <div className="absolute top-1 right-1 rounded-sm bg-white opacity-90 p-1" onClick={() => deleteImage(variationIndex)}>
                          {isPending ? <Spinner className="w-4 h-3" /> : <X className="w-4 h-4 text-red-500 " />}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          className="absolute  bottom-1 right-1  bg-white p-1 rounded-sm opacity-90"
                          onClick={() => {
                            handleOpenModal(variationIndex);
                          }}
                        >
                          <CropIcon className="text-red-500 w-4 h-4" />
                        </Button>
                        <CropVariationImageModal
                          variationIndex={variationIndex}
                          isOpen={isOpen}
                          setIsOpen={setIsOpen}
                          update={update}
                          previewUrls={previewUrls}
                          setPreviewUrls={setPreviewUrls}
                        />
                      </div>
                    ) : (
                      <div onClick={() => toggleAddImage(variationIndex)}>{isPending ? <Spinner /> : <ImagePlusIcon />}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <div className="grid grid-cols-4 border-b">
                      <FieldLabel classname="w-fit px-2 rounded-sm ">Name</FieldLabel>
                      <FieldLabel classname={cn("w-fit px-2 rounded-sm", watch("variationType") !== "VARIATION" ? "hidden" : "flex")}>
                        Price
                      </FieldLabel>
                      <FieldLabel classname={cn("w-fit px-2 rounded-sm", watch("variationType") !== "VARIATION" ? "hidden" : "flex")}>
                        Stock
                      </FieldLabel>
                      <FieldLabel classname={cn("w-fit px-2 rounded-sm", watch("variationType") !== "VARIATION" ? "hidden" : "flex")}>Sku</FieldLabel>
                    </div>
                    <VariationFieldError errors={errors} variationIndex={variationIndex} />

                    <div className="flex gap-1 md:gap-4 ">
                      <input
                        hidden
                        ref={(element) => {
                          hiddenFileInputs.current[variationIndex] = element;
                        }}
                        type="file"
                        onChange={(e) => onChangeImage(e, variationIndex)}
                      />
                      <Input
                        className={cn("h-fit px-2 py-1 text-xs font-light", watch("variationType") !== "VARIATION" && "w-fit")}
                        type="text"
                        {...register(`variations.${variationIndex}.name` as const)}
                        placeholder={`${watchVariationLabel} ${variationIndex + 1}`}
                        disabled={productsData && productsData.variations && !!productsData.variations[variationIndex]?.name}
                        required={getValues("variationType") === "VARIATION" || getValues("variationType") === "NESTED_VARIATION"}
                      />
                      {errors.variations && errors.variations[variationIndex]?.name && (
                        <span className="text-red-500">{errors.variations[variationIndex].name.message}</span>
                      )}

                      <Input
                        className="h-fit px-2 py-1 text-xs font-light"
                        {...register(`variations.${variationIndex}.price` as const)}
                        placeholder="price"
                        type="number"
                        step="0.01"
                        inputMode="decimal" // Helps on mobile devices to show numeric keyboard with decimal support
                        pattern="^\d+(\.\d{1,2})?$"
                        style={{
                          display: watch("variationType") !== "VARIATION" ? "none" : "flex",
                        }}
                        required={getValues("variationType") === "VARIATION"}
                      />
                      <Input
                        className="h-fit px-2 py-1 text-xs font-light"
                        {...register(`variations.${variationIndex}.stock` as const)}
                        placeholder="stock"
                        style={{
                          display: watch("variationType") !== "VARIATION" ? "none" : "flex",
                        }}
                        type="number"
                        required={getValues("variationType") === "VARIATION"}
                      />
                      <Input
                        className="h-fit px-2 py-1 text-xs font-light"
                        {...register(`variations.${variationIndex}.sku` as const)}
                        placeholder="sku"
                        style={{
                          display: watch("variationType") !== "VARIATION" ? "none" : "flex",
                        }}
                        disabled={productsData && productsData.variations && !!productsData.variations[variationIndex]?.sku}
                      />
                      <div className="absolute top-2 right-2">
                        <button
                          type="button"
                          onClick={() => removeFieldArray(variationIndex)}
                          className={cn(
                            (variationIndex === 0 || (productsData && productsData.variations && !!productsData.variations[variationIndex])) &&
                              "cursor-not-allowed"
                          )}
                          disabled={variationIndex === 0 || (productsData && productsData.variations && !!productsData.variations[variationIndex])}
                        >
                          <X className="w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <NestedVariationField productsData={productsData} variationIndex={variationIndex} />
                </div>
              );
            })}

            <div className="flex justify-center ">
              <Button
                className="flex  items-center w-fit text-sm font-light gap-2"
                variant="secondary"
                type="button"
                onClick={() => {
                  appendVariation({
                    label: getValues("variations.0.label"),
                    image: "",
                    name: "",
                    price: 0,
                    stock: 0,
                    sku: "",
                    nestedVariations: [
                      {
                        label: getValues("variations.0.nestedVariations.0.label"),
                        name: "",
                        price: 0,
                        stock: 0,
                        sku: "",
                      },
                    ],
                  });
                }}
              >
                <Plus />
                Add {watchVariationLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    </FormFieldWrapper>
  );
};

export default VariationField;
