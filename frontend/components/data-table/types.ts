import { ReactNode } from "react";

export interface DataTableColumn {
  /**
   * Unique key
   */
  key: string;

  /**
   * Header text
   */
  header: string;

  /**
   * Tailwind classes for header
   */
  className?: string;
}

export interface DataTableProps {
  /**
   * Table Heading
   */
  title?: string;

  /**
   * Columns
   */
  columns: DataTableColumn[];

  /**
   * Rows
   */
  children: ReactNode;
}