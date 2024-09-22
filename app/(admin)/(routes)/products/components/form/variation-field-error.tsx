import React from "react";
import { FieldErrors } from "react-hook-form";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

interface VariationFieldErrorProps {
  errors: FieldErrors<TProductSchema>;
  variationIndex: number;
}
const VariationFieldError: React.FC<VariationFieldErrorProps> = ({ errors, variationIndex }) => {
  return (
    <>
      {errors && errors.variations && errors.variations[variationIndex] && (
        <div>
          <FieldError error={errors.variations[variationIndex].image?.message} />
          <FieldError error={errors.variations[variationIndex].name?.message} />
          <FieldError error={errors.variations[variationIndex].price?.message} />
          <FieldError error={errors.variations[variationIndex].stock?.message} />
          <FieldError error={errors.variations[variationIndex].sku?.message} />
        </div>
      )}
    </>
  );
};

export default VariationFieldError;
