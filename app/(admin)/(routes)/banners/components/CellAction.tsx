"use client";

import { useCallback, useState, useTransition } from "react";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/modal/delete-modal";
import { toast } from "sonner";

import { BannerImage } from "@/lib/db/schema/bannerImages";
import { deleteBanner } from "@/actions/banner";

export const CellAction = ({ data }: { data: BannerImage }) => {
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
      console.log(data.url);
      const res = await deleteBanner(data.url);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
      }
      setOpen(false);
    });
  }, [data]);

  return (
    <div>
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
          <DropdownMenuItem onClick={() => router.push(`/banners/${data?.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
