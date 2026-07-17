"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;

  /**
   * Jis column par search karni hai
   * Example: "name", "email", "title"
   */
  searchKey: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
}: DataTableToolbarProps<TData>) {
  const column = table.getColumn(searchKey);
  const filterValue = (column?.getFilterValue() as string) ?? "";

  return (
  <div className="mb-4 flex items-center justify-between gap-4">
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        placeholder={`Search ${searchKey}...`}
        value={filterValue}
        onChange={(e) => column?.setFilterValue(e.target.value)}
        className="pl-10"
      />
    </div>

    {filterValue && (
      <Button
        variant="outline"
        onClick={() => column?.setFilterValue("")}
      >
        <X className="mr-2 h-4 w-4" />
        Clear
      </Button>
    )}
  </div>
);
}