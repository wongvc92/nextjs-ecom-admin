"use client";

import React, { useCallback, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MapPinned, MoreVertical, Trash } from "lucide-react";
import DeleteModal from "@/components/modal/delete-modal";
import { useRouter } from "next/navigation";
import { Sender } from "@/lib/db/schema/senders";
import { toast } from "sonner";
import { deleteSender, setDefaultSender } from "@/actions/senders";

const AddressAction = ({ sender }: { sender: Sender }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onConfirmDelete = useCallback(async () => {
    startTransition(async () => {
      if (!sender || !sender.id) return;
      if (sender.defaultSender === true) {
        toast.error("Please set a new default sender info before delete");
        setOpen(false);
        return;
      }

      const res = await deleteSender(sender.id);
      if (res.error) {
        toast.error(res.error);
        setOpen(false);
        return;
      } else if (res.success) {
        toast.success(res.success);
      }
      setOpen(false);
    });
  }, [sender]);

  const onSetDefaultSender = () => {
    startTransition(async () => {
      if (!sender || !sender.id) return;

      const res = await setDefaultSender(sender.id);
      if (res.error) {
        toast.error(res.error);
        return;
      } else if (res.success) {
        toast.success(res.success);
      }
    });
  };
  return (
    <>
      <DeleteModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        isPending={isPending}
        title="Delete adress"
        description="Are you sure to perform this action?"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onSetDefaultSender} className={`${sender.defaultSender === true && "hidden"}`}>
            <MapPinned className="mr-2 h-4 w-4" /> Set default
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push(`/shippings/sender/${sender.id}`)}>
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

export default AddressAction;
