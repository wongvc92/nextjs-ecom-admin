"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import FieldError from "../../products/components/form/field-error";
import { createCategory } from "@/actions/category";
import { useTransition } from "react";
import { categorySchema } from "@/lib/validation/categoryValidation";

const CreateForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", getValues("name"));
      const res = await createCategory(formData);
      if (res.error) {
        toast.error(res.error);
        return;
      } else if (res.success) {
        toast.success(res.success);
        reset();
        router.push("/categories");
        router.refresh();
      }
    });
  };

  return (
    <div className="px-4 space-y-4 py-8 w-full">
      <div className="flex items-center justify-between w-full ">
        <Heading title="Create category" description="Add a new category" />
        {/* 
        show the delete button if initialData is exist */}
      </div>
      <Separator />

      {/* <DisplayServerActionResponse result={result} /> */}
      {errors?.name ? <FieldError error={errors?.name.message as string} /> : ""}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="flex flex-col w-full md:w-fit  gap-8">
          <Input placeholder="Category name" {...register("name")} disabled={isPending} />
          <SubmitButton defaultTitle="Create Category" isLoading={isPending} isLoadingTitle="Creating category..." />
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
