"use client";

import { useCallback, useState, useTransition } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/modal/delete-modal";
import { toast } from "sonner";
import { deleteCategory } from "@/actions/category";
import { Category } from "@/lib/db/schema/categories";

export const CellAction = ({ data }: { data: Category }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Category ID copied to clipboard.");
  };

  const onConfirm = useCallback(async () => {
    startTransition(async () => {
      if (!data || !data.id) return;
      const formData = new FormData();
      formData.append("id", data.id);
      const res = await deleteCategory(formData);
      if (res.error) {
        toast.error(res.error);
        setOpen(false);
        return;
      } else if (res.success) {
        toast.success(res.success);
        router.refresh();
        setOpen(false);
      }
    });
  }, [data, router]);

  return (
    <>
      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        isPending={isPending}
        title="Delete category"
        description="Are you sure to perform this task?"
        onConfirm={onConfirm}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data?.id as string)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/categories/${data?.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
