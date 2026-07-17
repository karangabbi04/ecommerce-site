"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  // Sorting State
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Column Visibility State
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Create Table
  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnVisibility,
    },

    onSortingChange: setSorting,

    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getPaginationRowModel: getPaginationRowModel(),
  });

return (
  <div className="space-y-2 bg-red-200 p-4 rounded-xl">
    {/* Main Container */}

    <div className="flex items-center justify-between bg-orange-200 p-2 rounded">
      {/* Toolbar Area */}

      {/* <DataTableToolbar table={table} searchKey={searchKey} /> */}

      {/* <DataTableViewOptions table={table} /> */}
    </div>

    <div className="rounded-lg border  p-2">
      {/* Table Wrapper */}

      <Table >
        {/* Table */}

        <TableHeader >
          {/* THEAD */}

          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
            >
              {/* Header Row */}

              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                >
                  {/* Header Cell */}

                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="">
          {/* TBODY */}

          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className=" mt-2 !important"
              >
                {/* Data Row */}

                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className=""
                  >
                    {/* Data Cell */}

                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-red-400">
              <TableCell
                colSpan={columns.length}
                className="text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    <div className="bg-indigo-200 p-2 rounded">
      {/* Pagination */}

      {/* <DataTablePagination table={table} /> */}
    </div>
  </div>
);
}