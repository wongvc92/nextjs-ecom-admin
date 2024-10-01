"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateTrackingNumberByOrderId } from "@/actions/order";
import { useTransition } from "react";
import { toast } from "sonner";
import Spinner from "@/components/spinner";
import { trackingNumberSchema } from "@/lib/validation/trackingNumberValidation";

interface TrackingNumberFormProps {
  orderId: string;
  hideForm: () => void;
}
const TrackingNumberForm = ({ orderId, hideForm }: TrackingNumberFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof trackingNumberSchema>>({
    resolver: zodResolver(trackingNumberSchema),
    defaultValues: {
      tracking: "",
      orderId: orderId,
    },
  });

  async function onSubmit(values: z.infer<typeof trackingNumberSchema>) {
    startTransition(async () => {
      const res = await updateTrackingNumberByOrderId(values);
      if (res.success) {
        toast.success(res.success);
      } else if (res.error) {
        toast.error(res.error);
      }
      hideForm();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex gap-2 items-center">
        <FormField
          control={form.control}
          name="tracking"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-normal">Tracking number</FormLabel>
              <FormControl>
                <Input placeholder="Enter tracking number" {...field} className="text-xs text-muted-foreground" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input defaultValue={orderId} name="orderId" hidden />
        <Button type="submit">{isPending && <Spinner className="w-4 h-4" />}Update</Button>
      </form>
    </Form>
  );
};

export default TrackingNumberForm;
