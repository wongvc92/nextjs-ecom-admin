"use client";

import { deleteImageFromGallery } from "@/actions/gallery";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { IGallery } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

const DeleteAllImage = ({ galleries }: { galleries?: IGallery[] | null }) => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const handleDeleteAllImage = async () => {
    startTransition(async () => {
      if (!galleries) return;
      toast.loading("Deleting image");
      for (const item of galleries) {
        if (item.published === false) {
          const res = await deleteImageFromGallery(item.url);
          if (res.error) {
            toast.error(res.error);
            toast.dismiss();
            return;
          }
        }
      }
      toast.success("Images deleted");
      toast.dismiss();
    });
  };
  return (
    <>
      {galleries?.some((item) => item.published === false && searchParams.get("sort") === "unpublished") && (
        <Button type="button" onClick={handleDeleteAllImage} className="flex items-center gap-2">
          {isPending ? (
            <>
              <Spinner className="w-4 h-4" />
              Deleting...
            </>
          ) : (
            "Delete all"
          )}
        </Button>
      )}
    </>
  );
};

export default DeleteAllImage;
