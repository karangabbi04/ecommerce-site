"use client";

import Link from "next/link";
import { BadgeCheck, Box, Clock3, PackageCheck, ShoppingBag, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnConfig } from "@/components/data-table/DataTable";
import { useAccountOrders, useAccountProfile } from "@/hooks/queries/use-account-dashboard";
import type { AccountOrder } from "@/services/account.service";

function formatPrice(value: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "DELIVERED") return "default";
  if (status === "CANCELLED" || status === "REFUNDED") return "destructive";
  if (status === "PENDING" || status === "PROCESSING") return "outline";
  return "secondary";
}

const columns: ColumnConfig<AccountOrder>[] = [
  {
    header: "Order",
    cell: (order) => (
      <div>
        <p className="font-semibold">{order.orderNumber}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
    ),
  },
  {
    header: "Items",
    cell: (order) => {
      const firstItems = order.items.slice(0, 2);
      return (
        <div className="max-w-64 space-y-1">
          {firstItems.map((item, index) => (
            <p key={`${item.productName}-${index}`} className="truncate text-sm">
              {item.productName} <span className="text-muted-foreground">× {item.quantity}</span>
            </p>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-muted-foreground">+{order.items.length - 2} more items</p>
          )}
        </div>
      );
    },
  },
  {
    header: "Order status",
    cell: (order) => (
      <Badge variant={statusVariant(order.currentStatus)}>
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
    header: "Total",
    cell: (order) => <span className="whitespace-nowrap font-semibold">{formatPrice(order.total)}</span>,
  },
];

export default function AccountPage() {
  const profileQuery = useAccountProfile();
  const ordersQuery = useAccountOrders();
  const orders = ordersQuery.data ?? [];
  const deliveredOrders = orders.filter((order) => order.currentStatus === "DELIVERED").length;
  const paidTotal = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((total, order) => total + Number(order.total), 0);
  const displayName = profileQuery.data?.name || "Customer";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "C";

  if (profileQuery.isLoading || ordersQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl space-y-5 p-4 md:p-8">
        <div className="rounded-md border bg-background p-10 text-center text-sm text-muted-foreground">
          Loading your account...
        </div>
      </main>
    );
  }

  if (profileQuery.isError) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Sign in to view your account</CardTitle>
            <CardDescription>Your order history is available after you sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Your account</p>
          <h1 className="mt-1 text-2xl font-semibold">Welcome, {displayName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your details and keep track of your orders.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">
            <ShoppingBag aria-hidden="true" />
            Continue shopping
          </Link>
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="size-4 text-primary" aria-hidden="true" /> Account information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{displayName}</p>
                <p className="truncate text-sm text-muted-foreground">{profileQuery.data?.email}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm">
              <span className="text-muted-foreground">Email status</span>
              <Badge variant={profileQuery.data?.emailVerified ? "default" : "outline"}>
                {profileQuery.data?.emailVerified ? (
                  <><BadgeCheck aria-hidden="true" /> Verified</>
                ) : "Not verified"}
              </Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Member since {profileQuery.data?.createdAt ? new Date(profileQuery.data.createdAt).toLocaleDateString() : "—"}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700">
                <Box className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Total orders</p>
                <p className="text-xl font-semibold">{orders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                <PackageCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Delivered</p>
                <p className="text-xl font-semibold">{deliveredOrders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                <Clock3 className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Paid total</p>
                <p className="text-lg font-semibold">{formatPrice(paidTotal)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Your orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">Order status, payment, items, and totals.</p>
          </div>
          <Badge variant="outline">{orders.length} orders</Badge>
        </div>

        {ordersQuery.isError ? (
          <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
            Could not load your orders. Refresh the page to try again.
          </div>
        ) : orders.length ? (
          <DataTable data={orders} columns={columns} getRowId={(order) => order.id} scrollable />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <ShoppingBag className="size-8 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="font-medium">No orders yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Your placed orders will show up here.</p>
              </div>
              <Button asChild size="sm">
                <Link href="/products">Browse products</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
