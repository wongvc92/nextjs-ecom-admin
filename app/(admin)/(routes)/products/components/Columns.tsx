"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { Product } from "@/lib/db/schema/products";
import { Variation } from "@/lib/db/schema/variations";
import { convertCentsToTwoDecimalString, getDistinctNestedVariationNames } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, CheckIcon, XIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Product>[] = [
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
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <p className="line-clamp-2">{name}</p>;
    },
  },
  {
    accessorKey: "lowestPriceInCents",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <div
          onClick={column.getToggleSortingHandler()} // Attach the sorting toggle handler
          className="flex items-center cursor-pointer"
        >
          Price
          {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
          {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
          {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
        </div>
      );
    },
    cell: ({ row }) => {
      const priceInCents = row.getValue("lowestPriceInCents") as number;
      return convertCentsToTwoDecimalString(priceInCents);
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "isFeatured",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <div
          onClick={column.getToggleSortingHandler()} // Attach the sorting toggle handler
          className="flex items-center cursor-pointer"
        >
          Featured
          {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
          {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
          {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
        </div>
      );
    },
    cell: ({ row }) => {
      const isFeatured = row.getValue("isFeatured") as boolean;
      return (
        <div className="flex justify-center items-center">
          {isFeatured ? (
            <CheckIcon className="w-6 h-6 bg-emerald-200 rounded-full p-1 text-emerald-500" />
          ) : (
            <XIcon className="w-6 h-6 bg-red-200 rounded-full p-1 text-red-500" />
          )}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: false,
  },
  {
    accessorKey: "isArchived",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <div
          onClick={column.getToggleSortingHandler()} // Attach the sorting toggle handler
          className="flex items-center cursor-pointer"
        >
          Archived
          {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
          {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
          {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
        </div>
      );
    },

    cell: ({ row }) => {
      const isArchived = row.getValue("isArchived") as boolean;
      return <div className="flex justify-center items-center">{isArchived ? "Yes" : "No"}</div>;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      const sorted = column.getIsSorted();

      return (
        <div
          onClick={column.getToggleSortingHandler()} // Attach the sorting toggle handler
          className="flex items-center cursor-pointer"
        >
          Category
          {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
          {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
          {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
        </div>
      );
    },

    enableColumnFilter: false,
  },
  {
    accessorKey: "variations",
    header: "Variation",
    cell: ({ row }) => {
      const variations = row.getValue("variations") as Variation[];

      if (!variations || variations.length === 0) {
        return "";
      }

      return variations.map((variation) => variation.name).join(", ");
    },

    enableColumnFilter: false,
  },
  {
    accessorKey: "nestedVariations",
    header: "Nested",
    cell: ({ row }) => {
      const variations = row.getValue("variations") as Variation[];
      return getDistinctNestedVariationNames(variations);
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
      const date = row.getValue("createdAt") as string;
      return format(date, "dd/MM/yy HH:mm");
    },
    enableColumnFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
