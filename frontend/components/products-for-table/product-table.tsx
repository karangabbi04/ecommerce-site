"use client";

import { DataTable } from "@/components/data-table/data-table";

import { columns } from "./columns";
import { products } from "./data";

export default function ProductTable() {
  return (
    <DataTable
      columns={columns}
      data={products}
      searchKey="name"
    />
  );
}