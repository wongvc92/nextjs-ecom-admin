"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import FieldInput from "./field-input";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

const MinPurchaseField = () => {
  const {
    getValues,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods

  const data = getValues();

  const nestedVariationStockAllowed =
    data.variationType === "NESTED_VARIATION" &&
    data.variations?.reduce((min, variation) => {
      const nestedMin = variation.nestedVariations?.reduce((nestedMin, nestedVariation) => {
        const stock = parseInt(nestedVariation.stock as unknown as string, 10);
        if (isNaN(stock) || stock === 0) {
          return nestedMin;
        }
        return Math.min(nestedMin, stock);
      }, Infinity);
      return Math.min(min, nestedMin as number);
    }, Infinity);

  const variationStockAllowed =
    data.variationType === "VARIATION" &&
    data.variations?.reduce((min, variation) => {
      const stock = parseInt(variation.stock as unknown as string, 10);
      if (isNaN(stock) || stock === 0) {
        return min;
      }
      return Math.min(min, stock);
    }, Infinity);

  const maxStockAllowed =
    data.variationType === "NESTED_VARIATION" ? nestedVariationStockAllowed : data.variationType === "VARIATION" ? variationStockAllowed : data.stock;

  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="minPurchase">Minimum Purchase Quantity</FieldLabel>
      <div className="w-full flex-col space-y-2">
        <FieldInput disabled={isSubmitting} name="minPurchase" register={register} type="number" id="minPurchase" required={true} />
        <span className="text-[12px] text-muted-foreground">* Max number {maxStockAllowed} unit or lower allowed</span>
        {errors?.minPurchase && <FieldError error={errors?.minPurchase?.message as string} />}
      </div>
    </FormFieldWrapper>
  );
};

export default MinPurchaseField;
