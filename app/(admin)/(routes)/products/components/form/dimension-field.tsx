"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import { Input } from "@/components/ui/input";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

const DimensionField = () => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods
  return (
    <FormFieldWrapper>
      <div className="w-[700px]">
        <FieldLabel htmlFor="dimension">Dimension</FieldLabel>
      </div>
      <div className="w-full flex-col space-y-2">
        <FieldLabel htmlFor="height">Height (cm)</FieldLabel>
        <Input
          required
          disabled={isSubmitting}
          type="number"
          id="height"
          {...register("height", { valueAsNumber: true })}
          className="w-full"
          step="1"
        />
        {errors?.height && <FieldError error={errors?.height?.message} />}
      </div>
      <div className="w-full flex-col space-y-2">
        <FieldLabel htmlFor="width">Width (cm)</FieldLabel>
        <Input
          required
          disabled={isSubmitting}
          type="number"
          id="width"
          {...register("width", { valueAsNumber: true })}
          className="w-full"
          step="1"
        />
        {errors?.width && <FieldError error={errors?.width?.message} />}
      </div>
      <div className="w-full flex-col space-y-2">
        <FieldLabel htmlFor="length">Length (cm)</FieldLabel>
        <Input
          required
          disabled={isSubmitting}
          type="number"
          id="length"
          {...register("length", { valueAsNumber: true })}
          className="w-full"
          step="1"
        />
        {errors?.length && <FieldError error={errors?.length?.message} />}
      </div>
    </FormFieldWrapper>
  );
};

export default DimensionField;
