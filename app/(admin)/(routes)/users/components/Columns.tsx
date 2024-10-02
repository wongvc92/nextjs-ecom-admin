"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { Checkbox } from "@/components/ui/checkbox";
import TableSortButton from "@/components/ui/table-sort-button";
import { UserWithoutPassword } from "@/lib/db/schema/users";
import { format } from "date-fns";

export const columns: ColumnDef<UserWithoutPassword>[] = [
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
      return <TableSortButton title="Name" column={column} />;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <TableSortButton title="Role" column={column} />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <TableSortButton title="Email" column={column} />;
    },
  },

  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
      return <TableSortButton title="Email Verified" column={column} />;
    },
    cell: ({ row }) => {
      const date = row.getValue("emailVerified") as Date;
      const formattedDate = format(date, "dd/MM/yy HH:mm");
      return formattedDate;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "isTwoFactorEnabled",
    header: ({ column }) => {
      return <TableSortButton title="Two-Factor Enabled" column={column} />;
    },
  },
  {
    accessorKey: "isBlocked",
    header: ({ column }) => {
      return <TableSortButton title="Blocked" column={column} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    enableColumnFilter: false,
  },
];
