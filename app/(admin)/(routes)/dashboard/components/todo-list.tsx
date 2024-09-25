import { getTodoListCount } from "@/lib/db/queries/admin/dashboard";
import Link from "next/link";
import React from "react";

const TodoList = async () => {
  const { shippedCount, toShipCount, outofStockCount } = await getTodoListCount();

  const TODOLIST = [
    {
      id: 1,
      label: "Unpaid",
      count: 0,
      url: "#",
    },
    {
      id: 2,
      label: "To-Process shipment",
      count: toShipCount ?? 0,
      url: "/orders?page=1&perPage=5&status=toShip",
    },
    {
      id: 3,
      label: "Processed shipment",
      count: shippedCount ?? 0,
      url: "/orders?page=1&perPage=5&status=shipped",
    },
    {
      id: 4,
      label: "Pending cancellation",
      count: 0,
      url: "#",
    },
    {
      id: 5,
      label: "Pending return/refund",
      count: 0,
      url: "#",
    },
    {
      id: 6,
      label: "Out of stock",
      count: outofStockCount ?? 0,
      url: "/products?page=1&perPage=5&isOutOfStock=TRUE",
    },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
      {TODOLIST.map((item) => (
        <Link
          href={item.url}
          key={item.id}
          className={`border p-2 rounded-md flex flex-col justify-center text-muted-foreground items-center text-xs md:text-base break-words aspect-square max-h-32 flex-1 ${
            item.count === 0 && "pointer-events-none"
          }`}
        >
          <p className="text-muted-foreground text-center text-xl font-bold">{item.count}</p>
          <p className="text-center font-light">{item.label}</p>
        </Link>
      ))}
    </div>
  );
};

export default TodoList;
