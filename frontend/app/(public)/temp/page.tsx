// app/admin/orders/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ColumnConfig,
  DataTable,
} from "@/components/data-table/DataTable";
import { BulkActionBar } from "@/components/admin/bulkActionBar";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: string;
}

const mockOrders: Order[] = [
  { id: "ORD-101", customerName: "Rahul", amount: 2500, status: "pending" },
  { id: "ORD-102", customerName: "Priya", amount: 1200, status: "shipped" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleBulkUpdate = async (newStatus: string) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        selectedIds.includes(order.id)
          ? { ...order, status: newStatus }
          : order
      )
    );

    toast.success(`${selectedIds.length} orders updated.`);
    setSelectedIds([]);
  };

  const columns: ColumnConfig<Order>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
      className: "font-medium text-blue-600",
    },
    {
      header: "Customer",
      accessorKey: "customerName",
    },
    {
      header: "Amount",
      cell: (order) => (
        <span className="font-semibold">₹{order.amount.toLocaleString()}</span>
      ),
    },
    {
      header: "Status",
      cell: (order) => (
        <Badge
          variant={order.status === "delivered" ? "default" : "secondary"}
        >
          {order.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      
      {/* BULK ACTION BAR */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkUpdate={handleBulkUpdate}
      />

      {/* REUSABLE TABLE WITH SELECTION ENABLED */}
      <DataTable
        data={orders}
        columns={columns}
        isSelectable={true}
        selectedRowIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getRowId={(row) => row.id}
      />
    </div>
  );
}