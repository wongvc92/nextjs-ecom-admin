"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { settingsFormSchema, TSettingsFormSchema } from "@/lib/validation/auth-validation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { settings } from "@/actions/auth";
import { Switch } from "@/components/ui/switch";
import { Session } from "next-auth";
import { useTransition } from "react";
import Spinner from "@/components/spinner";

export const SettingsForm = ({ session }: { session: Session }) => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const form = useForm<TSettingsFormSchema>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: session && {
      name: session.user.name || undefined,
      email: session.user.email || undefined,
      role: session.user.role || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: session.user.isTwoFactorEnabled || false,
    },
  });

  const onSubmit = async (formData: TSettingsFormSchema) => {
    startTransition(async () => {
      const res = await settings(formData);

      if (res.error) {
        toast.error(res.error);
      }
      if (res.success) {
        update();
        toast.success(res.success);
      }
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Name</FormLabel>
                <FormControl>
                  <Input type="code" {...field} disabled={isPending} />
                </FormControl>
                {form.formState.errors.name && <FormMessage>{form.formState.errors.name.message}</FormMessage>}
              </FormItem>
            )}
          />
          {session?.user?.isOAuth === false && (
            <div>
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
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending} />
                    </FormControl>

                    {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending} />
                    </FormControl>

                    {form.formState.errors.newPassword && <FormMessage>{form.formState.errors.newPassword.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
          )}

          <div>
            <p className="text-muted-foreground">
              Role: <span className="rounded-md text-sm bg-muted p-1 text-black">{session?.user.role}</span>
            </p>
          </div>
          <FormField
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-muted-foreground">Two Factor Authentication</FormLabel>
                  <FormDescription>Enable two factor authentication for your account</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                </FormControl>

                {form.formState.errors.isTwoFactorEnabled && <FormMessage>{form.formState.errors.isTwoFactorEnabled.message}</FormMessage>}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="w-4 h-4" /> Updating info...
              </span>
            ) : (
              "Update info"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
