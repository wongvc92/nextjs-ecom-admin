"use client";

import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useFormContext } from "react-hook-form";
import FieldLabel from "./field-label";
import FieldError from "./field-error";
import { TProductSchema } from "@/lib/validation/productValidation";

const FeaturedField = () => {
  const {
    watch,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods
  const handleCheckBox = (isChecked: boolean) => {
    if (isChecked) {
      setValue("isFeatured", true);
    } else {
      setValue("isFeatured", false);
    }
  };
  return (
    <div className="flex items-start gap-2 border rounded-md p-2 w-fit">
      <Checkbox
        disabled={isSubmitting}
        {...register("isFeatured")}
        onCheckedChange={(isChecked) => handleCheckBox(isChecked as boolean)}
        defaultChecked={watch("isFeatured")}
      />
      <div className="w-full flex-col space-y-2">
        <FieldLabel htmlFor="isFetured">Feature</FieldLabel>
        <p className="text-muted-foreground text-[12px]">This product will be on the featured section of the store.</p>
        {errors?.description && <FieldError error={errors?.isFeatured?.message as string} />}
      </div>
    </div>
  );
};

export default FeaturedField;
