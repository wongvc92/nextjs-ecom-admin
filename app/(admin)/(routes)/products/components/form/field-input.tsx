import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TProductSchema } from "@/lib/validation/productValidation";

import React from "react";
import { UseFormRegister } from "react-hook-form";

interface IFieldInput {
  type: "number" | "text";
  id?: string;
  register: UseFormRegister<TProductSchema>;
  name: keyof TProductSchema;
  disabled: boolean;
  required: boolean;
  classname?: string;
  step?: string;
  inputMode?: "email" | "search" | "tel" | "text" | "url" | "none" | "numeric" | "decimal";
  pattern?: string;
}

const FieldInput: React.FC<IFieldInput> = ({ type, id, register, name, disabled, required, classname, step, inputMode, pattern }) => {
  return (
    <Input
      type={type}
      id={id}
      {...register(name)}
      className={cn(classname)}
      disabled={disabled}
      required={required}
      step={step}
      inputMode={inputMode}
      pattern={pattern}
    />
  );
};

export default FieldInput;
