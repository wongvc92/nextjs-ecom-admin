"use client";
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  PaginationState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { downloadToExcel } from "@/lib/xlxs";
import { IContent } from "json-as-xlsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/usebounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalPage: number;
}

export function DataTable<TData, TValue>({ columns, data, totalPage }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(columnFilters, 1000);
  const pathname = usePathname();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [toggleOpen, setToggleOpen] = useState(false);

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageSize = (perPage: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("perPage", perPage);
    router.push(`${pathname}?${params.toString()}`);
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Filter configuration
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: true,
    // Sort configuration
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // getFilteredRowModel: getFilteredRowModel(), // not needed for manual server-side filtering

    // Pagination configuration
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 ">
        <DropdownMenu open={toggleOpen} onOpenChange={() => setToggleOpen(!toggleOpen)}>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="ml-auto text-muted-foreground text-xs gap-1" size="sm" type="button">
              Column
              <ChevronDown className={toggleOpen ? "rotate-180 transition duration-300" : "transition duration-300"} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize text-muted-foreground text-xs"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => {
                    column.toggleVisibility(!!value);
                  }}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={() => downloadToExcel(data as IContent[])} size="sm" className="text-xs">
          Export to excel{" "}
        </Button>
      </div>
      <div>
        <div className="rounded-md border bg-white shadow-sm dark:bg-inherit w-full ">
          <Table className="text-xs font-light">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col items-center md:flex-row md:justify-center md:gap-10 md:items-center">
        <div className="flex items-center justify-center space-x-2 py-4">
          <Link
            href={createPageUrl(currentPage - 1)}
            className={`border flex justify-center items-center rounded-md px-2 py-1 text-xs text-muted-foreground ${
              currentPage === 1 && "cursor-not-allowed pointer-events-none text-muted"
            }`}
          >
            Previous
          </Link>
          <Link
            href={createPageUrl(currentPage + 1)}
            className={`border flex justify-center items-center rounded-md px-2 py-1 text-xs text-muted-foreground ${
              currentPage >= totalPage && "cursor-not-allowed pointer-events-none text-muted"
            }`}
          >
            Next
          </Link>
        </div>
        <div>
          <Select onValueChange={handlePageSize}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:ml-auto text-sm text-muted-foreground py-4">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
      </div>
    </>
  );
}
