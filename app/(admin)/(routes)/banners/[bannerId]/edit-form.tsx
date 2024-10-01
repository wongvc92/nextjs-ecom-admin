"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ImagesField from "../components/images-field";
import { Heading } from "@/components/ui/heading";
import SubmitButton from "@/components/submit-button";
import { editBanner } from "@/actions/banner";
import { toast } from "sonner";
import { BannerImage } from "@/lib/db/schema/bannerImages";
import { bannerImageSchema, TBannerImageFormSchema } from "@/lib/validation/bannerImagesValidation";
import { useRouter } from "next/navigation";

interface EditFormProps {
  data: BannerImage;
}
const EditForm: React.FC<EditFormProps> = ({ data }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const methods = useForm<TBannerImageFormSchema>({
    defaultValues: data ? { id: data.id, url: data.url } : { id: "", url: "" },
    mode: "all",
    resolver: zodResolver(bannerImageSchema),
  });

  const onSubmit = async () => {
    startTransition(async () => {
      if (!methods.getValues()) return;

      const res = await editBanner(methods.getValues());
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
        router.push("/banners");
      }
    });
  };

  return (
    <div className="px-4 space-y-8 py-8 w-full min-h-screen">
      <div className="flex flex-col space-y-4">
        <Heading title="Edit Banner" description="Banner will be shown in the home page of the store" />

        {/* 
    show the delete button if initialData is exist */}
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <ImagesField />
          <div>
            <SubmitButton defaultTitle="Submit" isLoadingTitle="Submitting" isLoading={isPending} />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditForm;
