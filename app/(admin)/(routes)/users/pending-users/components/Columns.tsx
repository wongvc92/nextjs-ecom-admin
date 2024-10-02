"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { Checkbox } from "@/components/ui/checkbox";
import TableSortButton from "@/components/ui/table-sort-button";
import { PendingNewUser } from "@/lib/db/schema/users";
import { format } from "date-fns";

export const columns: ColumnDef<PendingNewUser>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return <TableSortButton title="Email" column={column} />;
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <TableSortButton title="Created" column={column} />;
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return format(date, "dd/MM/yy HH:mm");
    },
    enableColumnFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    enableColumnFilter: false,
  },
];
