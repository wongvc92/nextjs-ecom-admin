"use client";

import { newVerification } from "@/actions/auth";
import Spinner from "@/components/spinner";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) return;
    newVerification(token)
      .then((data) => {
        toast.error(data.error);
        toast.success(data.success);
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex flex-col space-y-4 items-center">
      <p>Confirm your verification</p>
      <Spinner />
      <p>Back to login</p>
    </div>
  );
};

export default NewVerificationForm;