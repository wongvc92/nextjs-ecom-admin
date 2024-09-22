"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import FieldInput from "./field-input";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

const StockField = () => {
  const {
    getValues,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods

  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="stock">Stock</FieldLabel>

      <div className="w-full flex-col space-y-2">
        <FieldInput
          name="stock"
          register={register}
          type="number"
          id="stock"
          disabled={isSubmitting}
          required={getValues("variationType") === "NONE"}
        />
        {errors?.stock && <FieldError error={errors?.stock?.message as string} />}
      </div>
    </FormFieldWrapper>
  );
};

export default StockField;
