"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import FieldError from "./field-error";
import { Input } from "@/components/ui/input";
import { TProductSchema } from "@/lib/validation/productValidation";

const WeightField = () => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods
  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="weight">Weight</FieldLabel>

      <div className="w-full flex-col space-y-2">
        <Input
          disabled={isSubmitting}
          type="number"
          id="weight"
          {...register("weight", { valueAsNumber: true })}
          className="w-full"
          step="0.1"
          inputMode="decimal" // Helps on mobile devices to show numeric keyboard with decimal support
          min="0.1"
          required={true}
        />
        {errors?.weight && <FieldError error={errors?.weight?.message} />}
      </div>
    </FormFieldWrapper>
  );
};

export default WeightField;
