"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { senderFormSchema, TSenderFormSchema } from "@/lib/validation/courierValidation";
import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { editSender } from "@/actions/senders";
import SubmitButton from "@/components/submit-button";

interface UpdateFormProps {
  defaultValues: TSenderFormSchema;
}

const EditForm = ({ defaultValues }: UpdateFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<TSenderFormSchema>({
    resolver: zodResolver(senderFormSchema),
    defaultValues, // This will prefill the form with the existing values for updating
  });

  const onSubmit = () => {
    startTransition(async () => {
      const res = await editSender(getValues());
      if (res.error) {
        toast.error(res.error);
      }
      if (res.success) {
        toast.success(res.success);
        router.push("/shippings");
      }
    });
  };

  return (
    <>
      <div className="px-4 pt-8">
        <Heading title="Update Sender Information" description="Update an existing sender's information" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input id="id" placeholder="id" {...register("id")} hidden />
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Dialing Country Code and Phone */}
        <div className="w-full md:flex md:gap-2">
          <div>
            <Label htmlFor="dialing_country_code">Dialing Country Code</Label>
            <Input id="dialing_country_code" placeholder="MY" {...register("dialing_country_code")} />
            {errors.dialing_country_code && <p className="text-red-500">{errors.dialing_country_code.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="60123456789" {...register("phone")} />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="example@gmail.com" {...register("email")} />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        {/* Address 1 */}
        <div>
          <Label htmlFor="address_1">Address Line 1</Label>
          <Input id="address_1" placeholder="123, Jalan Hang Tuah" {...register("address_1")} />
          {errors.address_1 && <p className="text-red-500">{errors.address_1.message}</p>}
        </div>

        {/* Address 2 */}
        <div>
          <Label htmlFor="address_2">Address Line 2</Label>
          <Input id="address_2" placeholder="Taman Harimau" {...register("address_2")} />
          {errors.address_2 && <p className="text-red-500">{errors.address_2.message}</p>}
        </div>

        <div className="w-full md:flex md:gap-2">
          {/* Postcode */}
          <div>
            <Label htmlFor="postcode">Postcode</Label>
            <Input id="postcode" placeholder="50200" {...register("postcode")} />
            {errors.postcode && <p className="text-red-500">{errors.postcode.message}</p>}
          </div>

          {/* Province */}
          <div>
            <Label htmlFor="province">Province</Label>
            <Input id="province" placeholder="Kuala Lumpur" {...register("province")} />
            {errors.province && <p className="text-red-500">{errors.province.message}</p>}
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Kuala Lumpur" {...register("city")} />
            {errors.city && <p className="text-red-500">{errors.city.message}</p>}
          </div>
        </div>

        {/* Country */}
        <div className="w-full md:w-fit">
          <Label htmlFor="country">Country</Label>
          <Input id="country" placeholder="MY" {...register("country")} />
          {errors.country && <p className="text-red-500">{errors.country.message}</p>}
        </div>

        {/* Submit Button */}
        <SubmitButton defaultTitle="Edit Sender" isLoading={isPending} isLoadingTitle="Editing sender..." />
      </form>
    </>
  );
};

export default EditForm;
