"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { format } from "date-fns";
import { BannerImage } from "@/lib/db/schema/bannerImages";
import Image from "next/image";
import { updateBannerOrderById } from "@/actions/banner";
import { Button } from "@/components/ui/button";
import TableSortButton from "@/components/ui/table-sort-button";

export const columns: ColumnDef<BannerImage>[] = [
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
    accessorKey: "url",
    header: ({ column }) => {
      return <TableSortButton title="banner" column={column} />;
    },
    cell: ({ row }) => {
      const url = row.getValue("url") as string;
      return (
        <div className="aspect-video relative h-20">
          <Image src={url} alt="Banner Image" layout="fill" objectFit="cover" className="rounded-md" />
        </div>
      );
    },
  },
  {
    id: "order",
    header: "Rearrange",
    cell: ({ row, table }) => {
      const data = table.options.data;
      const index = row.index;

      const moveUp = async () => {
        if (index > 0) {
          const currentItem = data[index];
          const itemAbove = data[index - 1];

          // Swap the order values
          const currentOrder = currentItem.order;
          const aboveOrder = itemAbove.order;

          // Update in the database using server actions
          await updateBannerOrderById(currentItem.id, aboveOrder);
          await updateBannerOrderById(itemAbove.id, currentOrder);
        }
      };

      const moveDown = async () => {
        if (index < data.length - 1) {
          const currentItem = data[index];
          const itemBelow = data[index + 1];

          // Swap the order values
          const currentOrder = currentItem.order;
          const belowOrder = itemBelow.order;

          // Update in the database using server actions
          await updateBannerOrderById(currentItem.id, belowOrder);
          await updateBannerOrderById(itemBelow.id, currentOrder);
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={moveUp}
            disabled={index === 0}
            className={`${index === 0 ? "text-muted" : "text-muted-foreground"}`}
          >
            <ChevronUpIcon />
          </Button>
          <Button
            size="icon"
            type="button"
            variant="outline"
            onClick={moveDown}
            disabled={index === data.length - 1}
            className={`${index === data.length - 1 ? "text-muted" : "text-muted-foreground"}`}
          >
            <ChevronDownIcon />
          </Button>
        </div>
      );
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
