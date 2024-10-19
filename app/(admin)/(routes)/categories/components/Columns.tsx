"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Category } from "@/lib/db/schema/categories";
import TableSortButton from "@/components/ui/table-sort-button";
import DeleteTableRows from "./delete-table-rows";

export const columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const selectedRowIds = table.getSelectedRowModel().rows.map((row) => (row.original as ColumnDef<Category>).id);

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
    accessorKey: "name",
    header: ({ column }) => {
      return <TableSortButton title="name" column={column} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <TableSortButton title="created" column={column} />;
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
  },
];
