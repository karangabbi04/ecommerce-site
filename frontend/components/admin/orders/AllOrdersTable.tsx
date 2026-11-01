"use client";

import { ColumnConfig, DataTable } from "@/components/data-table/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllOrders } from "@/hooks/queries/use-orders";
import { AdminOrder } from "@/services/order.service";
import { useState } from "react";

const columns: ColumnConfig<AdminOrder>[] = [
  {
    header: "Order",
    cell: (order) => <span className="font-medium">{order.orderNumber}</span>,
  },
  {
    header: "Customer",
    cell: (order) => (
      <div>
        <p className="font-medium">{order.customerName}</p>
        <p className="text-xs text-muted-foreground">
          {order.customerEmail ?? "No email"}
        </p>
      </div>
    ),
  },
  {
    header: "Total",
    cell: (order) => `₹${Number(order.total).toLocaleString("en-IN")}`,
  },
  {
    header: "Order status",
    cell: (order) => (
      <Badge variant="secondary">
        {order.currentStatus.replaceAll("_", " ")}
      </Badge>
    ),
  },
  {
    header: "Payment",
    cell: (order) => (
      <Badge variant={order.paymentStatus === "PAID" ? "default" : "outline"}>
        {order.paymentStatus.replaceAll("_", " ")}
      </Badge>
    ),
  },
  {
    header: "Placed",
    cell: (order) => new Date(order.createdAt).toLocaleDateString(),
  },
];

export default function AllOrdersTable() {
  const { data: orders = [], isLoading, isError, error } = useAllOrders();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredOrders = orders.filter((order) => {
    const statusMatches =
      statusFilter === "ALL" || order.currentStatus === statusFilter;
    const createdAt = new Date(order.createdAt);
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDateExclusive = dateTo
      ? new Date(`${dateTo}T00:00:00`)
      : null;

    if (toDateExclusive) {
      toDateExclusive.setDate(toDateExclusive.getDate() + 1);
    }

    return (
      statusMatches &&
      (!fromDate || createdAt >= fromDate) &&
      (!toDateExclusive || createdAt < toDateExclusive)
    );
  });

  if (isLoading) {
    return (
      <p className="py-8 text-center text-muted-foreground">Loading orders...</p>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="py-8 text-center text-destructive">
        {error instanceof Error ? error.message : "Could not load orders."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border bg-white p-4 sm:flex-row sm:items-end">
        <label className="grid gap-1.5 text-sm font-medium">
          From date
          <input
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(event) => setDateFrom(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 font-normal"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          To date
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(event) => setDateTo(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 font-normal"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          Order status
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PACKED">Packed</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out for delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <button
          type="button"
          onClick={() => {
            setDateFrom("");
            setDateTo("");
            setStatusFilter("ALL");
          }}
          className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted"
        >
          Reset filters
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredOrders.length} of {orders.length} orders
      </p>

      {filteredOrders.length === 0 ? (
        <p className="rounded-md border bg-white py-8 text-center text-muted-foreground">
          No orders match these filters.
        </p>
      ) : (
        <DataTable
          data={filteredOrders}
          columns={columns}
          isSelectable
          getRowId={(order) => order.id}
          emptyMessage="No orders found."
        />
      )}
    </div>
  );
}