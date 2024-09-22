"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { settingsSchema, TSettingsSchema } from "@/lib/validation/auth-validation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { settings } from "@/actions/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Session } from "next-auth";

export const SettingsForm = ({ session }: { session: Session }) => {
  const { update } = useSession();

  const form = useForm<TSettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: session && {
      name: session.user.name || undefined,
      email: session.user.email || undefined,
      role: session.user.role || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: session.user.isTwoFactorEnabled || false,
    },
  });

  const onSubmit = async (formData: TSettingsSchema) => {
    const res = await settings(formData);
    if (res.error) {
      toast.error(res.error);
    }
    if (res.success) {
      update();
      toast.success(res.success);
    }
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Name</FormLabel>
                <FormControl>
                  <Input type="code" {...field} defaultValue={field.value} />
                </FormControl>
                {form.formState.errors.name && <FormMessage>{form.formState.errors.name.message}</FormMessage>}
              </FormItem>
            )}
          />
          {session?.user?.isOAuth === false && (
            <>
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                      <Input type="password" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>

                    {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role"></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                  </SelectContent>
                </Select>

                {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-muted-foreground">Two Factor Authentication</FormLabel>
                  <FormDescription>Enable two factor authentication for your account</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>

                {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            update info
          </Button>
        </form>
      </Form>
    </div>
  );
};
