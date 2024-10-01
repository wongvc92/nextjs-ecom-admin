import { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from "lucide-react";
import React from "react";

interface TableSortButtonProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}
const TableSortButton = <TData, TValue>({ column, title }: TableSortButtonProps<TData, TValue>) => {
  const sorted = column.getIsSorted();
  return (
    <div onClick={column.getToggleSortingHandler()} className="flex items-center cursor-pointer">
      {title}
      {sorted === "asc" && <ArrowUpIcon className="ml-2 w-4 h-4" />}
      {sorted === "desc" && <ArrowDownIcon className="ml-2 w-4 h-4" />}
      {sorted === false && <ArrowUpDown className="ml-2 w-4 h-4" />}
    </div>
  );
};

export default TableSortButton;
