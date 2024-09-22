"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { TProductSchema } from "@/lib/validation/productValidation";
import React from "react";
import { useFormContext } from "react-hook-form";
import FieldLabel from "./field-label";
import FieldError from "./field-error";

const ArchiveField = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods
  const handleCheckBox = (isChecked: boolean) => {
    if (isChecked) {
      setValue("isArchived", true);
    } else {
      setValue("isArchived", false);
    }
  };

  return (
    <div className="flex items-start gap-2 border rounded-md p-2 w-fit">
      <Checkbox
        disabled={isSubmitting}
        {...register("isArchived")}
        onCheckedChange={(isChecked) => handleCheckBox(isChecked as boolean)}
        defaultChecked={watch("isArchived")}
      />
      <div className="w-full flex-col space-y-2">
        <FieldLabel htmlFor="isArchived">Archive</FieldLabel>
        <p className="text-muted-foreground text-[12px]">This product will not show on the store.</p>
        {errors?.description && <FieldError error={errors?.isArchived?.message as string} />}
      </div>
    </div>
  );
};

export default ArchiveField;
