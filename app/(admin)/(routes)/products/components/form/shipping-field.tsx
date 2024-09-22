"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import { Input } from "@/components/ui/input";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

const ShippingField = () => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods
  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="shippingFee">Shipping Fee</FieldLabel>

      <div className="w-full flex-col space-y-2">
        <Input
          required
          disabled={isSubmitting}
          type="number"
          id="shippingFee"
          {...register("shippingFee", { valueAsNumber: true })}
          className="w-full"
          step="0.01"
        />
        {errors?.shippingFee && <FieldError error={errors?.shippingFee?.message} />}
      </div>
    </FormFieldWrapper>
  );
};

export default ShippingField;
