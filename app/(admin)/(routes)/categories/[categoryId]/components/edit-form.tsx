"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import DeleteCategory from "./delete-category";
import { useRouter } from "next/navigation";
import { editCategory } from "@/actions/category";
import SubmitButton from "@/components/submit-button";
import FieldError from "../../../products/components/form/field-error";
import { useTransition } from "react";
import { categorySchema, TCategorySchema } from "@/lib/validation/categoryValidation";

interface CategoryFormProps {
  initialData?: TCategorySchema;
}

const EditForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: "all",
    defaultValues: { id: initialData?.id, name: initialData?.name },
  });

  const onSubmit = async () => {
    startTransition(async () => {
      if (!getValues()) return;
      const formData = new FormData();
      formData.append("id", getValues("id") as string);
      formData.append("name", getValues("name") as string);
      const res = await editCategory(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
        router.push("/categories");
        router.refresh();
      }
    });
  };

  if (!initialData) {
    return null;
  }

  return (
    <div className="px-4 space-y-4 py-8">
      <div className="flex items-center justify-between w-full ">
        <Heading title="Edit category" description="Edit existing category" />
        {/* 
        show the delete button if initialData is exist */}
        {initialData && <DeleteCategory initialData={initialData} />}
      </div>
      <Separator />
      {/* <DisplayServerActionResponse result={result} /> */}
      {errors?.name ? <FieldError error={errors?.name.message as string} /> : ""}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="w-full md:grid lg:grid-cols-3 gap-8">
          <input {...register("id")} disabled={isPending} hidden />
          <Input placeholder="Category name" {...register("name")} disabled={isPending} />
        </div>
        <SubmitButton defaultTitle="Edit Category" isLoading={isPending} isLoadingTitle="Editing category..." />
      </form>
    </div>
  );
};
export default EditForm;
