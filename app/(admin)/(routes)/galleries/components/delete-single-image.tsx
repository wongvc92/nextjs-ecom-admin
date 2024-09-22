"use client";

import { deleteImageFromGallery } from "@/actions/gallery";
import Spinner from "@/components/spinner";
import { X } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";

const DeleteSingleImage = ({ url }: { url: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleDeleteImage = () => {
    startTransition(async () => {
      const res = await deleteImageFromGallery(url);
      if (res.error) {
        toast.error(res.error);
        return;
      } else if (res.success) {
        toast.success(res.success);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDeleteImage}
      className=" absolute top-2 right-2  bg-zinc-500 rounded-full p-1 opacity-50 cursor-pointer flex items-center justify-center "
    >
      {isPending ? <Spinner className="h-4 w-4" /> : <X className="text-white w-4 h-4 " />}
    </button>
  );
};

export default DeleteSingleImage;
