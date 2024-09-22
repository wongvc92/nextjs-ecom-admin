"use client";

import { useFormContext } from "react-hook-form";
import FormFieldWrapper from "./form-field-wrapper";
import FieldLabel from "./field-label";
import FieldError from "./field-error";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { TProductSchema } from "@/lib/validation/productValidation";

const TagsField = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<TProductSchema>(); // retrieve all hook methods

  const [tags, setTags] = useState<string[]>(watch("tags") || []);
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAddTags = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (!input.trim()) return;
    const updatedTags = [...tags, input];
    setTags(updatedTags);
    setValue("tags", updatedTags);
    setInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((item) => item !== tagToRemove);
    setTags(updatedTags);
    setValue("tags", updatedTags);
  };

  return (
    <FormFieldWrapper>
      <FieldLabel htmlFor="tags">Tags</FieldLabel>
      <div className="w-full flex-col space-y-2 ">
        <Input
          type="text"
          disabled={isSubmitting}
          value={input}
          onKeyDown={handleAddTags}
          onChange={handleInputChange}
          placeholder="Enter a tag and press Enter"
        />
        <div className="flex gap-2 items-center ">
          {tags?.map((tag) => (
            <div key={tag} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground flex items-center gap-1">
              <span>{tag}</span>
              <button type="button" onClick={() => handleRemoveTag(tag)}>
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        {errors.name && <FieldError error={errors?.name?.message as string} />}
      </div>
    </FormFieldWrapper>
  );
};

export default TagsField;
