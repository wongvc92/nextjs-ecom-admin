"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ImagesField from "../components/images-field";
import { Heading } from "@/components/ui/heading";
import SubmitButton from "@/components/submit-button";
import { createBanner } from "@/actions/banner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bannerImagesSchema, TBannerImagesFormSchema } from "@/lib/validation/bannerImagesValidation";

const CreateForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const methods = useForm<TBannerImagesFormSchema>({
    defaultValues: {
      bannerImages: [],
    },
    mode: "all",
    resolver: zodResolver(bannerImagesSchema),
  });

  const onSubmit = async () => {
    startTransition(async () => {
      if (!methods.getValues()) return;

      const res = await createBanner(methods.getValues());
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
        router.push("/banners");
        router.refresh();
      }
    });
  };

  return (
    <div className="px-4 space-y-4 py-8 w-full min-h-screen">
      <div className="flex items-center justify-between w-full ">
        <Heading title="Create category" description="Add a new category" />
        {/* 
    show the delete button if initialData is exist */}
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 sm:px-4 ">
          <ImagesField />
          <SubmitButton defaultTitle="Submit" isLoadingTitle="Submitting" isLoading={isPending} />
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateForm;