"use client";

import DeleteModal from "@/components/modal/delete-modal";
import React, { useCallback, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/product";
import { TProductSchema } from "@/lib/validation/productValidation";

interface DeleteCategoryProps {
  data: TProductSchema;
}
const DeleteProduct: React.FC<DeleteCategoryProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = useCallback(async () => {
    startTransition(async () => {
      if (!data || !data.id) return;
      const formData = new FormData();
      formData.append("id", data.id);
      const res = await deleteProduct(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
        router.push("/products");
        router.refresh();
      }
      setOpen(false);
    });
  }, [data, router]);

  return (
    <>
      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isPending={isPending}
        title="Delete category"
        description="Are you are you to perform this task?"
      />

      <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={isPending} type="button">
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};

export default DeleteProduct;
