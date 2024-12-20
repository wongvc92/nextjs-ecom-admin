"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { cn, convertCentsToTwoDecimalString } from "@/lib/utils";
import { Order } from "@/lib/db/schema/orders";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import TableSortButton from "@/components/ui/table-sort-button";
import DeleteTableRows from "./delete-table-rows";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const selectedRowIds = table.getSelectedRowModel().rows.map((row) => (row.original as ColumnDef<Order>).id);
      return (
        <div className="flex items-center gap-2 w-fit">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
          />
          <DeleteTableRows selectedRowIds={selectedRowIds as string[]} resetSelection={table.resetRowSelection} />
        </div>
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
      return <TableSortButton title="Name" column={column} />;
    },
  },
  {
    accessorKey: "amountInCents",
    header: ({ column }) => {
      return <TableSortButton title="Amount" column={column} />;
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
      return <TableSortButton title="Status" column={column} />;
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={cn("px-2 py-1 rounded-full text-xs font-semibold text-center capitalize", {
            "bg-red-100 text-red-700": status === "cancelled",
            "bg-orange-100 text-orange-700": status === "pending",
            "bg-yellow-100 text-yellow-700": status === "to_ship",
            "bg-green-100 text-green-700": status === "shipped",
            "bg-blue-100 text-blue-700": status === "completed",
          })}
        >
          {status.split("_").join(" ")}
        </span>
      );
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <TableSortButton title="Created" column={column} />;
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
