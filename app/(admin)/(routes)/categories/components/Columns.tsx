"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import { format } from "date-fns";
import { Category } from "@/lib/db/schema/categories";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "name",
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
      console.log(date);
      const formattedDate = format(date, "dd/MM/yy HH:mm");
      return formattedDate;
    },
    enableColumnFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
