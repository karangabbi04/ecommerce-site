"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Product } from "./types";
import ProductImage from "./product-image";
import ProductStatusBadge from "./proudct-status";
import ProductActions from "./product-action";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",

    cell: ({ row }) => (
      <ProductImage
        image={row.original.image}
        name={row.original.name}
        subtitle={row.original.subtitle}
      />
    ),
  },

  {
    accessorKey: "category",
    header: "Category",
  },

  {
    accessorKey: "price",
    header: "Price",
  },

 

  {
    accessorKey: "sold",
    header: "Sold",
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => (
      <ProductStatusBadge
        status={row.original.status}
      />
    ),
  },

  {
    id: "actions",

    cell: () => <ProductActions />,
  },
];