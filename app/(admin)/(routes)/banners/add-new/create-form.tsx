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
import { bannerImageSchema, TBannerImageFormSchema } from "@/lib/validation/bannerImagesValidation";

const CreateForm = ({ bannerImagesCount }: { bannerImagesCount: number | null }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const methods = useForm<TBannerImageFormSchema>({
    defaultValues: {
      id: "",
      url: "",
    },
    mode: "all",
    resolver: zodResolver(bannerImageSchema),
  });

  const onSubmit = async () => {
    startTransition(async () => {
      if (!methods.getValues() || bannerImagesCount === null || bannerImagesCount === undefined) return;
      console.log("bannerImagesCount", bannerImagesCount);
      let orderNumber = 0;
      if (bannerImagesCount > 0) {
        orderNumber = bannerImagesCount + 1;
      } else {
        orderNumber = 0;
      }

      const res = await createBanner(methods.getValues(), orderNumber);
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
        <Heading title="Create banner" description="Add a new banner" />
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
