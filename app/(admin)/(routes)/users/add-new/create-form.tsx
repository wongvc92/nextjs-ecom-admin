"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import SubmitButton from "@/components/submit-button";
import { useRouter } from "next/navigation";
import FieldError from "../../products/components/form/field-error";
import { useTransition } from "react";
import { TuserFormSchema, userFormSchema } from "@/lib/validation/userValidation";
import { inviteNewUser } from "@/actions/user";

const CreateForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<TuserFormSchema>({
    resolver: zodResolver(userFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", getValues("email"));
      const res = await inviteNewUser(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
        reset();
        router.push("/users");
        router.refresh();
      }
    });
  };

  return (
    <div className="px-4 space-y-4 py-8 w-full">
      <div className="flex items-center justify-between w-full ">
        <Heading title="Invite user" description="Add a new user" />
        {/* 
        show the delete button if initialData is exist */}
      </div>
      <Separator />

      {/* <DisplayServerActionResponse result={result} /> */}
      {errors?.email ? <FieldError error={errors?.email.message as string} /> : ""}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="flex flex-col w-full md:w-fit  gap-8">
          <Input placeholder="insert new user email" {...register("email")} disabled={isPending} />
          <SubmitButton defaultTitle="Invite User" isLoading={isPending} isLoadingTitle="Inviting user..." />
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
