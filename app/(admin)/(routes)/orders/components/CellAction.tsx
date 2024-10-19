"use client";

import { Copy, MoreHorizontal, PackageIcon, ScrollText, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Order } from "@/lib/db/schema/orders";
import { deleteOrder } from "@/actions/order";
import { useTransition } from "react";

interface CellActionProps {
  data: Order;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard.");
  };

  const onDeleteOrder = async () => {
    startTransition(async () => {
      const res = await deleteOrder(data.id);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/orders/${data.id}`)}>
            <ScrollText className="mr-2 h-4 w-4" />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteOrder} disabled={isPending}>
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
