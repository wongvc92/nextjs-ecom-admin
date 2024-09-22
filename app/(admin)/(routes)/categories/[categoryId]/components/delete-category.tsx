"use client";

import DeleteModal from "@/components/modal/delete-modal";
import React, { useCallback, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/actions/category";
import { TCategorySchema } from "@/lib/validation/categoryValidation";

interface DeleteCategoryProps {
  initialData: TCategorySchema;
}
const DeleteCategory: React.FC<DeleteCategoryProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = useCallback(async () => {
    startTransition(async () => {
      if (!initialData) return;
      const formData = new FormData();
      formData.append("id", initialData.id as string);
      const res = await deleteCategory(formData);

      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);

        router.push("/categories");
        router.refresh();
        setOpen(false);
      }
    });
  }, [initialData, router]);

  return (
    <>
      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isPending={isPending}
        title="Delete category"
        description="Are you sure to perform this task?"
      />

      <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={isPending} type="button">
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};

export default DeleteCategory;
