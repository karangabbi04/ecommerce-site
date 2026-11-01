// components/shared/DataTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, InboxIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

// 1. Generic Type for Column Configuration
export interface ColumnConfig<T> {
  header: string; // Table header text
  accessorKey?: keyof T; // For simple data (e.g., 'customerName')
  cell?: (row: T, index: number) => ReactNode; // For custom UI (Badges, Actions)
  className?: string; // Tailwind classes for specific column
  hideOnMobile?: boolean; // Bonus: Responsive design
}

// 2. Generic Type for DataTable Props
interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  // NEW PROPS FOR SELECTION
  isSelectable?: boolean;
  selectedRowIds?: string[]; // Assuming your data has an 'id' field
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T) => string; // Helper to extract ID from generic T
  scrollable?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage,
  isSelectable = false,
  selectedRowIds = [],
  onSelectionChange,
  getRowId,
  scrollable = false,
}: DataTableProps<T>) {

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange || !getRowId) return;
    if (checked) {
      onSelectionChange(data.map(row => getRowId(row)));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedRowIds, rowId]);
    } else {
      onSelectionChange(selectedRowIds.filter(id => id !== rowId));
    }
  };

  const isAllSelected = data.length > 0 && selectedRowIds.length === data.length;

  return (
    <div
      className={`rounded-md border bg-white shadow-sm ${
        scrollable ? "max-h-[65vh] overflow-auto" : "overflow-x-auto"
      }`}
    >
      <Table>
        <TableHeader className={scrollable ? "sticky top-0 z-10 bg-white" : undefined}>
          <TableRow className="bg-gray-50/50">
            {/* NEW: Select All Checkbox */}
            {isSelectable && (
              <TableHead className="w-12.5">
                <Checkbox 
                  checked={isAllSelected} 
                  onCheckedChange={handleSelectAll} 
                />
              </TableHead>
            )}
            {columns.map((col, idx) => (
              <TableHead key={idx} className={col.className}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => {
            const rowId = getRowId ? getRowId(row) : rowIndex.toString();
            const isSelected = selectedRowIds.includes(rowId);

            return (
              <TableRow key={rowId} data-state={isSelected ? "selected" : undefined}>
                {/* NEW: Row Checkbox */}
                {isSelectable && (
                  <TableCell className="w-10">
                    <Checkbox 
                      checked={isSelected} 
                      onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)} 
                    />
                  </TableCell>
                )}
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className={col.className}>
                    {col.cell ? col.cell(row, rowIndex) : row[col.accessorKey!] as any}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}