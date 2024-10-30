"use client";

import { Copy, MoreHorizontal, UserRoundCog, UserRoundPlus, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { UserWithoutPassword } from "@/lib/db/schema/users";
import { useState, useTransition } from "react";
import { blockUser, makeAdmin, makeUser, unblockUser } from "@/actions/user";

interface CellActionProps {
  data: UserWithoutPassword;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("User ID copied to clipboard.");
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onBlockUser = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email as string);
      const res = await blockUser(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
      }
      onClose();
    });
  };

  const onUnblockUser = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email as string);
      const res = await unblockUser(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
      }
      onClose();
    });
  };

  const onMakeAdmin = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email as string);
      const res = await makeAdmin(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
      }
      onClose();
    });
  };

  const onMakeUser = async () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email as string);
      const res = await makeUser(formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
      }
      onClose();
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={onClose}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsOpen(true)}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          <Copy className="mr-2 h-4 w-4" /> Copy Id
        </DropdownMenuItem>
        {data.role === "USER" && (
          <DropdownMenuItem onClick={onMakeAdmin}>
            <UserRoundCog className="mr-2 h-4 w-4" /> Make admin
          </DropdownMenuItem>
        )}
        {data.role === "ADMIN" && (
          <DropdownMenuItem onClick={onMakeUser}>
            <UserRoundCog className="mr-2 h-4 w-4" /> Make user
          </DropdownMenuItem>
        )}
        {data.isBlocked === false && (
          <DropdownMenuItem onClick={onBlockUser}>
            {isPending ? (
              "Blocking..."
            ) : (
              <div className="flex items-center">
                <UserRoundX className="mr-2 h-4 w-4" /> Block
              </div>
            )}
          </DropdownMenuItem>
        )}
        {data.isBlocked === true && (
          <DropdownMenuItem onClick={onUnblockUser}>
            {isPending ? (
              "unblocking..."
            ) : (
              <div className="flex items-center">
                <UserRoundPlus className="mr-2 h-4 w-4" /> Unblock
              </div>
            )}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
