import { Textarea } from "@/components/ui/textarea";
import { TProductSchema } from "@/lib/validation/productValidation";

import React from "react";
import { UseFormRegister } from "react-hook-form";

interface IFieldTextarea {
  id?: string;
  register: UseFormRegister<TProductSchema>;
  name: keyof TProductSchema;
  disabled: boolean;
  required: boolean;
}
const FieldTextarea: React.FC<IFieldTextarea> = ({ id, register, name, disabled }) => {
  return (
    <div className="w-full space-y-2">
      <Textarea id={id} {...register(name)} className="w-full" rows={14} disabled={disabled} required />
    </div>
  );
};

export default FieldTextarea;
