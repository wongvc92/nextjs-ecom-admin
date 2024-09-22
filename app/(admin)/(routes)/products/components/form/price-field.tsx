"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import FieldInput from "./field-input";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

const PriceField = () => {
  const {
    getValues,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods

  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="price">Price</FieldLabel>

      <div className="w-full flex-col space-y-2">
        <FieldInput
          required={getValues("variationType") === "NONE"}
          name="price"
          id="price"
          type="number"
          step="0.01"
          inputMode="decimal" // Helps on mobile devices to show numeric keyboard with decimal support
          pattern="^\d+(\.\d{1,2})?$"
          register={register}
          disabled={isSubmitting}
        />
        {errors?.price && <FieldError error={errors?.price?.message as string} />}
      </div>
    </FormFieldWrapper>
  );
};

export default PriceField;
