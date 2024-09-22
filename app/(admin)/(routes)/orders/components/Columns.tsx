"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { cn, convertCentsToTwoDecimalNumber, convertCentsToTwoDecimalString } from "@/lib/utils";
import { Order } from "@/lib/db/schema/orders";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef } from "react";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "productName",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <div
          onClick={column.getToggleSortingHandler()} // Attach the sorting toggle handler
          className="flex items-center cursor-pointer"
        >
          Name
          {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
          {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
          {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
        </div>
      );
    },
  },
  {
    accessorKey: "amountInCents",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <div
          onClick={column.getToggleSortingHandler()} // Attach the sorting toggle handler
          className="flex items-center cursor-pointer"
        >
          Amount
          {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
          {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
          {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("amountInCents") as number;
      return convertCentsToTwoDecimalString(amount);
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <div
          onClick={column.getToggleSortingHandler()} // Attach the sorting toggle handler
          className="flex items-center cursor-pointer"
        >
          Status
          {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
          {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
          {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={cn("px-2 py-1 rounded-full text-xs font-semibold text-center", {
            "bg-red-100 text-red-700": status === "cancelled",
            "bg-orange-100 text-orange-700": status === "pending",
            "bg-yellow-100 text-yellow-700": status === "toShip",
            "bg-green-100 text-green-700": status === "shipped",
            "bg-blue-100 text-blue-700": status === "completed",
          })}
        >
          {status}
        </span>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <div
          onClick={column.getToggleSortingHandler()} // Attach the sorting toggle handler
          className="flex items-center cursor-pointer"
        >
          Created
          {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
          {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
          {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
        </div>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      const formattedDate = format(date, "dd/MM/yy HH:mm");
      return formattedDate;
    },
    enableColumnFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    enableColumnFilter: false,
  },
];
