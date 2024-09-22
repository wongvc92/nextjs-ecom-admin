"use client";

import DuplicateVariation from "./duplicate-variation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldArrayWithId, UseFieldArrayAppend, useFormContext } from "react-hook-form";
import FieldError from "./field-error";
import Spinner from "@/components/spinner";
import { toast } from "sonner";
import { useTransition } from "react";
import { deleteVariationImage } from "@/actions/product";
import { TProductSchema } from "@/lib/validation/productValidation";

interface IVariationCheckbox {
  productsData?: TProductSchema;
  variationFields: FieldArrayWithId<TProductSchema, "variations">[];
  appendVariation: UseFieldArrayAppend<TProductSchema>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
}
const VariationCheckbox: React.FC<IVariationCheckbox> = ({ productsData, variationFields, appendVariation, setPreviewUrls }) => {
  const [isPending, startTransition] = useTransition();
  const {
    watch,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods

  const handleCheckVariation2 = (isChecked: boolean) => {
    if (isChecked) {
      setValue("variationType", "NESTED_VARIATION");
      variationFields.forEach((_, index) => {
        setValue(`variations.${index}.price`, 0);
        setValue(`variations.${index}.stock`, 0);
        setValue(`variations.${index}.sku`, "");
      });
    } else {
      setValue("variationType", "VARIATION");
    }
  };

  const handleCheckVariation1 = async (isChecked: boolean) => {
    startTransition(async () => {
      if (isChecked) {
        setValue("variationType", "VARIATION");
      } else {
        const imageToDelete = [] as string[];
        getValues("variations")?.forEach((item) => imageToDelete.push(item.image as string));
        for (const image of imageToDelete) {
          if (image) {
            const deleteRes = await deleteVariationImage(image);
            if (deleteRes.error) {
              toast.error(deleteRes.error);
              return;
            }
          }
        }
        variationFields.forEach((_, index) => setValue(`variations.${index}.label`, ""));
        setValue("variationType", "NONE");
        setPreviewUrls([]);
      }
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <div className={cn("flex items-start gap-4", productsData ? "hidden" : "flex")}>
        <div className="flex items-center gap-2">
          <Checkbox id="variationCheckbox1" onCheckedChange={(isChecked) => handleCheckVariation1(isChecked as boolean)} />
          <p className={cn("text-sm text-muted-foreground font-light", watch("variationType") === "NESTED_VARIATION" && "hidden")}>
            {watch("variationType") === "NONE" && "Enable variation (Optional)"}
          </p>
          {isPending && <Spinner className="w-4 h-4" />}
        </div>
        <div className="flex flex-col gap-2 relative">
          <div
            className={cn(
              "absolute top-0 left-0  px-2 h-8 bg-muted rounded-l-sm text-sm py-2",
              (watch("variationType") === "VARIATION" || watch("variationType") === "NESTED_VARIATION") && "block w-fit",
              watch("variationType") === "NONE" && "hidden"
            )}
          >
            Variation 1
          </div>

          <Input
            className={cn(
              "text-sm font-light w-fit pl-24 h-8",
              watch("variationType") === "VARIATION" || watch("variationType") === "NESTED_VARIATION" ? "w-fit" : "hidden"
            )}
            required={getValues("variationType") === "VARIATION" || getValues("variationType") === "NESTED_VARIATION"}
            type="text"
            {...register(`variations.0.label` as const)}
            placeholder="label for variation"
          />
          {errors.variations && errors.variations[0]?.label && <FieldError error={errors.variations[0]?.label.message} />}
        </div>
      </div>

      {(watch("variationType") === "VARIATION" || watch("variationType") === "NESTED_VARIATION") && (
        <div className={cn("flex items-start gap-4", productsData ? "hidden" : "flex")}>
          <div className="flex items-center gap-2">
            <Checkbox id="variationCheckbox2" onCheckedChange={(isChecked) => handleCheckVariation2(isChecked as boolean)} />
            <p className={cn("text-sm text-muted-foreground font-light", watch("variationType") === "NESTED_VARIATION" && "hidden")}>
              {watch("variationType") === "VARIATION" && "Variation 2 (Optional)"}
            </p>
          </div>
          <div className="flex flex-col gap-2 relative">
            <div
              className={cn(
                "absolute top-0 left-0  px-2 h-8 bg-muted rounded-l-sm text-sm py-2",
                watch("variationType") !== "NESTED_VARIATION" ? "hidden" : "block w-fit"
              )}
            >
              Variation 2
            </div>
            <Input
              className={cn("text-sm font-light w-fit pl-24 h-8", watch("variationType") !== "NESTED_VARIATION" ? "hidden" : "block w-fit")}
              type="text"
              {...register(`variations.0.nestedVariations.0.label` as const)}
              placeholder="label for variation 2"
              required={getValues("variationType") === "NESTED_VARIATION"}
            />
            {errors.variations && errors.variations[0] && <FieldError error={errors.variations[0]?.nestedVariations?.[0]?.label?.message} />}
          </div>
        </div>
      )}

      <DuplicateVariation appendVariation={appendVariation} />
    </div>
  );
};

export default VariationCheckbox;
