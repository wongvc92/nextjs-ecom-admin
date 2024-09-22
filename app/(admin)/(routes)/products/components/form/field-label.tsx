import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";

interface FieldLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  classname?: string;
}

const FieldLabel: React.FC<FieldLabelProps> = ({ htmlFor, children, classname }) => {
  return (
    <Label htmlFor={htmlFor} className={cn("text-sm font-light text-muted-foreground  w-full md:w-1/4", classname)}>
      {children}
    </Label>
  );
};

export default FieldLabel;
