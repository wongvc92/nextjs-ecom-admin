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
    <>
      <h4 className="py-4">To do list</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 ">
        {TODOLIST.map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className={`border p-2 rounded-md flex flex-col justify-center items-center text-muted-foreground text-xs md:text-base break-words aspect-square ${
              item.count === 0 && "pointer-events-none"
            }`}
          >
            <p className="text-sky-500 text-center text-2xl">{item.count}</p>
            <p className="text-center font-light">{item.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default TodoList;
