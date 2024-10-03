"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { signInSchema, TSignInSchema } from "@/lib/validation/auth-validation";
import { signIn } from "next-auth/react";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signInUser } from "@/actions/auth";
import { DEFAULT_REDIRECT_LOGIN } from "@/routes";
import Spinner from "@/components/spinner";

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (formData: TSignInSchema) => {
    startTransition(async () => {
      const res = await signInUser(formData, callbackUrl);
      if (!res) {
        return;
      }
      if (res.error) {
        form.reset();
        toast.error(res.error);
      }
      if (res.success) {
        form.reset();
        toast.success(res.success);
      }
      if (res?.twoFactor) {
        setShowTwoFactor(true);
      }
    });
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <Button
        disabled={isPending}
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
        onClick={async () =>
          await signIn("google", {
            callbackUrl: callbackUrl || DEFAULT_REDIRECT_LOGIN,
          })
        }
      >
        <FaGoogle /> Sign in with Google
      </Button>
      <Button
        disabled={isPending}
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
        onClick={async () =>
          await signIn("facebook", {
            callbackUrl: callbackUrl || DEFAULT_REDIRECT_LOGIN,
          })
        }
      >
        <FaFacebookF /> Sign in with Facebook
      </Button>
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-muted-foreground text-xs"> Or sign in with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {showTwoFactor && (
            <FormField
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Two Factor Code</FormLabel>
                  <FormControl>
                    <Input type="code" {...field} placeholder="123456" disabled={isPending} />
                  </FormControl>
                  {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (
            <>
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
                    <Button variant="link" size="sm" asChild className="px-0" type="button" disabled={isPending}>
                      <Link href="/auth/reset" className="mt-10">
                        Forgot password?
                      </Link>
                    </Button>
                    {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? (
              "Confirm"
            ) : isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <p className=" flex items-center gap-1 text-xs font-light text-muted-foreground self-center">
        Do not have an account?{" "}
        <Link href="/auth/sign-up" className="font-bold">
          Sign up
        </Link>
      </p>
    </div>
  );
};
