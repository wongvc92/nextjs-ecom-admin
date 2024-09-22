"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, TSignUpFormSchema } from "@/lib/validation/auth-validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerUser } from "@/actions/auth";
import { toast } from "sonner";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignUpForm = () => {
  const form = useForm<TSignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: TSignUpFormSchema) => {
    const res = await registerUser(data);
    if (res?.error) {
      toast.error(res.error);
    } else if (res?.success) {
      toast.success(res.success);
    }
    // Handle form submission
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
        onClick={async () => await signIn("google")}
      >
        <FaGoogle /> Sign up with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
        onClick={async () => await signIn("facebook")}
      >
        <FaFacebookF /> Sign up with Facebook
      </Button>
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-muted-foreground text-xs"> Or sign up with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                {form.formState.errors.confirmPassword && <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>
      </Form>
      <p className=" flex items-center gap-1 text-xs font-light text-muted-foreground self-center">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-bold">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
