"use client";

import React, { useTransition } from "react";
import { resetSignIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetSignInSchema, TResetSignInSchema } from "@/lib/validation/auth-validation";
import Spinner from "@/components/spinner";

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<TResetSignInSchema>({
    resolver: zodResolver(resetSignInSchema),
  });

  const onSubmit = async (formData: TResetSignInSchema) => {
    startTransition(async () => {
      const res = await resetSignIn(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
      }
    });
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <p className="text-center">Forgot your password?</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={isPending} />
                </FormControl>
                {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                Resetting password...
              </span>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetForm;
