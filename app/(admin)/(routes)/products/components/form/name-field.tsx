"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import FieldInput from "./field-input";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

const NameField = () => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods

  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="name">Product Name</FieldLabel>
      <div className="w-full flex-col space-y-2">
        <FieldInput name="name" register={register} type="text" id="name" disabled={isSubmitting} required={true} />
        {errors.name && <FieldError error={errors?.name?.message as string} />}
      </div>
    </FormFieldWrapper>
  );
};

export default NameField;
