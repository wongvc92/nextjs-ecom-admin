"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import FieldError from "./field-error";
import { X } from "lucide-react";
import Link from "next/link";
import { TCategorySchema } from "@/lib/validation/categoryValidation";
import { TProductSchema } from "@/lib/validation/productValidation";

interface CategoryFieldProps {
  distinctCategories?: TCategorySchema[];
}

const CategoryField: React.FC<CategoryFieldProps> = ({ distinctCategories }) => {
  const {
    watch,
    register,
    setValue: setCategoryValue,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods

  const selectedCategory = watch("category");

  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="category"> Category </FieldLabel>
      <div className="w-full flex-col space-y-2">
        {selectedCategory && (
          <div className="flex w-fit gap-2 items-center">
            <div className="text-xs text-muted-foreground ">Selected category: </div>
            <div className="relative px-1">
              <div className=" px-2 py-1 rounded-md bg-orange-300 border-orange-500 text-center text-xs dark:text-black">{selectedCategory}</div>
              <div
                className="absolute -top-1 right-0 bg-red-500  flex text-center items-center justify-center  rounded-full  text-[12px] cursor-pointer"
                onClick={() => {
                  setCategoryValue("category", "");
                }}
              >
                <X className=" text-white w-3 h-3" />
              </div>
            </div>
          </div>
        )}
        {distinctCategories && distinctCategories.length === 0 ? (
          <Link href="/categories/add-new">Create category</Link>
        ) : (
          <select className="border p-2 rounded-md  text-sm" {...register("category")} id="category" required>
            <option value="">Choose a category</option>
            {distinctCategories?.map((item) => (
              <option value={item.name} key={item.id} disabled={isSubmitting}>
                {item.name}
              </option>
            ))}
          </select>
        )}

        {errors.category && <FieldError error={errors?.category?.message as string} />}
      </div>
    </FormFieldWrapper>
  );
};

export default CategoryField;
