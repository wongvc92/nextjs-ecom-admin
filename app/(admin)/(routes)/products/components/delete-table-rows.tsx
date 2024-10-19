"use client";

import { deleteProduct } from "@/actions/product";
import DeleteModal from "@/components/modal/delete-modal";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const DeleteTableRows = ({ selectedRowIds, resetSelection }: { selectedRowIds: string[]; resetSelection: () => void }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onConfirm = () => {
    startTransition(async () => {
      if (!selectedRowIds) return;

      for (const selectedRowId of selectedRowIds) {
        const formData = new FormData();
        formData.append("id", selectedRowId);
        const res = await deleteProduct(formData);
        if (res.error) {
          toast.error(res.error);
        }
      }
      toast.success("selected product deleted");
      resetSelection();
      setOpen(false);
    });
  };
  return (
    <>
      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        isPending={isPending}
        title="Delete selected product"
        description="Are you sure to perform this task?"
        onConfirm={onConfirm}
      />
      <Button
        disabled={isPending}
        type="button"
        variant="destructive"
        size="icon"
        className={`w-fit p-2 ${selectedRowIds.length > 0 ? "flex" : "hidden"}`}
        onClick={() => setOpen(true)}
      >
        <Trash2Icon className="w-4 h-4" />
      </Button>
    </>
  );
};

export default DeleteTableRows;
