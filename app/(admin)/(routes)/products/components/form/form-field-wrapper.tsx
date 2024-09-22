import { cn } from "@/lib/utils";
import React from "react";

interface IFormFieldWrapper {
  children: React.ReactNode;
  classname?: string;
}

const FormFieldWrapper: React.FC<IFormFieldWrapper> = ({ children, classname }) => {
  return <div className={cn("flex flex-col md:flex-row gap-2", classname)}>{children}</div>;
};

export default FormFieldWrapper;
