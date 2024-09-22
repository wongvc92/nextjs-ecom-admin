import { TProductSchema } from "@/lib/validation/productValidation";
import React from "react";
import { FieldErrors } from "react-hook-form";

interface NestedVariationFieldErrorProps {
  errors: FieldErrors<TProductSchema>;
  variationIndex: number;
  nestedIndex: number;
}
const NestedVariationFieldError: React.FC<NestedVariationFieldErrorProps> = ({ errors, variationIndex, nestedIndex }) => {
  return (
    <div>
      {errors &&
        errors.variations &&
        errors.variations[variationIndex]?.nestedVariations &&
        errors.variations[variationIndex]?.nestedVariations[nestedIndex]?.name && (
          <div className="text-red-500 text-xs font-light">{errors.variations[variationIndex].nestedVariations[nestedIndex].name.message}</div>
        )}
      {errors &&
        errors.variations &&
        errors.variations[variationIndex]?.nestedVariations &&
        errors.variations[variationIndex]?.nestedVariations[nestedIndex]?.price && (
          <div className="text-red-500 text-xs font-light">{errors.variations[variationIndex].nestedVariations[nestedIndex].price.message}</div>
        )}
      {errors &&
        errors.variations &&
        errors.variations[variationIndex]?.nestedVariations &&
        errors.variations[variationIndex]?.nestedVariations[nestedIndex]?.stock && (
          <div className="text-red-500 text-xs font-light">{errors.variations[variationIndex].nestedVariations[nestedIndex].stock.message}</div>
        )}
      {errors &&
        errors.variations &&
        errors.variations[variationIndex]?.nestedVariations &&
        errors.variations[variationIndex]?.nestedVariations[nestedIndex]?.sku && (
          <div className="text-red-500 text-xs font-light">{errors.variations[variationIndex].nestedVariations[nestedIndex].sku.message}</div>
        )}
    </div>
  );
};

export default NestedVariationFieldError;
