"use client";

import { createShipment } from "@/actions/courier";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/db/schema/orders";
import React, { useTransition } from "react";
import { toast } from "sonner";

const ShipButton = ({ order }: { order: Order }) => {
  const [isPending, startTransition] = useTransition();
  const onSubmit = async () => {
    startTransition(async () => {
      const res = await createShipment(order.id, order.courierServiceId);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (res.success) {
        toast.success(res.success);
        return;
      }
    });
  };
  return (
    <Button type="button" disabled={isPending} onClick={onSubmit} className="flex items-center gap-2 text-sm w-fit">
      {isPending ? (
        <>
          <Spinner className="w-4 h-4" />
          Shiping...
        </>
      ) : (
        <>Ship now</>
      )}
    </Button>
  );
};

export default ShipButton;
