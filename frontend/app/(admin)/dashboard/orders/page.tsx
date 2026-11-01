"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { BulkActionBar } from "@/components/admin/bulkActionBar";
import { OrderFilters } from "@/components/admin/orders/orderFilter";
import { ColumnConfig, DataTable } from "@/components/data-table/DataTable";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useFilteredOrders } from "@/hooks/queries/use-orders";
import { AdminOrder } from "@/services/order.service";

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
        {String(order.currentStatus ?? order.status).replaceAll("_", " ")}
      </Badge>
    ),
  },
  {
    header: "Payment",
    cell: (order) => (
      <Badge
        variant={order.paymentStatus === "PAID" ? "default" : "outline"}
      >
        {String(order.paymentStatus ?? "PENDING").replaceAll("_", " ")}
      </Badge>
    ),
  },
  {
    header: "Placed",
    cell: (order) => new Date(order.createdAt).toLocaleDateString(),
  },
];

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <main className="space-y-6 p-6">
          <div className="rounded-md border bg-background p-8 text-center text-muted-foreground">
            Loading orders...
          </div>
        </main>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleBulkUpdate = async (newStatus: string) => {
    if (!selectedIds.length) return;

    const normalizedStatus = newStatus.toUpperCase();

    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        api.post("/order/updateOrderStatus", {
          orderId: id,
          status: normalizedStatus,
        })
      )
    );

    const updatedOrderMap = new Map<string, Partial<AdminOrder>>();
    const failedOrderIds: string[] = [];
    const failureMessages: string[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const updatedOrder = result.value.data?.data ?? result.value.data ?? {};
        if (updatedOrder?.id) {
          updatedOrderMap.set(updatedOrder.id, updatedOrder);
        }
      } else {
        failedOrderIds.push(selectedIds[index]);
        const responseMessage = result.reason?.response?.data?.message;
        failureMessages.push(
          responseMessage || result.reason?.message || "Could not update an order."
        );
      }
    });

    queryClient.setQueriesData(
      { queryKey: ["orders", "filters"] },
      (previousData: any) => {
        if (!previousData || !Array.isArray(previousData.orders)) {
          return previousData;
        }

        const nextOrders = previousData.orders.map((order: AdminOrder) => {
          const updatedOrder = updatedOrderMap.get(order.id);
          if (!updatedOrder) return order;
          return { ...order, ...updatedOrder };
        });

        return {
          ...previousData,
          orders: nextOrders,
        };
      }
    );

    const successfulCount = selectedIds.length - failedOrderIds.length;
    if (successfulCount > 0) {
      toast.success(`${successfulCount} order(s) updated to ${normalizedStatus}.`);
    }

    setSelectedIds(failedOrderIds);
    if (failureMessages.length > 0) {
      throw new Error([...new Set(failureMessages)].join(" "));
    }
  };

  const filters = useMemo(() => {
    const status = searchParams.get("status") || "ALL";
    const datePreset = searchParams.get("date_preset") || "all";
    const startDate = searchParams.get("start_date") || "";
    const endDate = searchParams.get("end_date") || "";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const params: Record<string, string | number | undefined> = {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
    };

    if (status && status !== "ALL") {
      params.status = status.toUpperCase();
    }

    if (datePreset === "today") {
      params.dateType = "today";
    } else if (datePreset === "yesterday") {
      params.dateType = "yesterday";
    } else if (datePreset === "last_7") {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 6);
      params.startDate = from.toISOString().slice(0, 10);
      params.endDate = to.toISOString().slice(0, 10);
    } else if (datePreset === "last_30") {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 29);
      params.startDate = from.toISOString().slice(0, 10);
      params.endDate = to.toISOString().slice(0, 10);
    } else if (datePreset === "custom") {
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
    }

    return params;
  }, [searchParams]);

  const { data, isLoading, isError, error } = useFilteredOrders(filters);
  const orders = data?.orders ?? [];
  const currentPage = Number(filters.page ?? 1);
  const totalPages = Number(data?.pagination?.totalPages ?? 1);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(nextUrl as any, { scroll: false });
  };

  return (
    <main className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">All Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review order details, payment state, and fulfillment status.
        </p>
      </header>

      <OrderFilters />

      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkUpdate={handleBulkUpdate}
      />

      {isLoading ? (
        <div className="rounded-md border bg-background p-8 text-center text-muted-foreground">
          Loading orders...
        </div>
      ) : isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
          {error instanceof Error ? error.message : "Could not load orders."}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Showing {orders.length} of {data?.pagination?.total ?? orders.length} orders
          </p>

          <DataTable
            data={orders}
            columns={columns}
            emptyMessage="No orders found for the selected filters."
            isSelectable
            selectedRowIds={selectedIds}
            onSelectionChange={setSelectedIds}
            getRowId={(order) => order.id}
          />

          <div className="flex items-center justify-between rounded-md border bg-background px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
