"use client";

import { Copy, MoreHorizontal, PackageIcon, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Order } from "@/lib/db/schema/orders";
import { updateOrderStatusByOrderId } from "@/actions/order";

interface CellActionProps {
  data: Order;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard.");
  };

  const onOrderReceived = async (id: string) => {
    const formData = new FormData();
    formData.append("status", "completed");
    formData.append("id", id);

    const res = await updateOrderStatusByOrderId(formData);

    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      toast.success(res.success);
    }
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
          <DropdownMenuItem onClick={() => onOrderReceived(data.id)}>
            <PackageIcon className="mr-2 h-4 w-4" />
            Order received
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
