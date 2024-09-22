"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import FieldTextarea from "./field-textarea";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

const DescriptionField = () => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods
  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="description"> Description </FieldLabel>
      <div className="w-full flex-col space-y-2">
        <FieldTextarea disabled={isSubmitting} name="description" register={register} id="description" required={true} />
        {errors?.description && <FieldError error={errors?.description?.message as string} />}
      </div>
    </FormFieldWrapper>
  );
};

export default DescriptionField;
