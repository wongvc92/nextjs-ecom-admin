"use client";

import { newPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { newPasswordSchema, TNewPasswordSchema } from "@/lib/validation/auth-validation";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const form = useForm<TNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = (formData: TNewPasswordSchema) => {
    if (!token) return;
    newPassword(formData, token)
      .then((data) => {
        toast.error(data.error);
        toast.success(data.success);
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <p className="text-center">Enter a new password</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Send reset email
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;
