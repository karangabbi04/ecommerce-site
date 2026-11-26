"use client"

import React, { useEffect } from 'react'
import AnalyticsCard from '@/components/admin/dashboard/analytics/AnalyticsCard'
import {KPICard} from '@/components/admin/dashboard/KPI-card/KPICard'
import { KPIGrid } from '@/components/admin/dashboard/KPI-card/KPIGrid'
import { QuickActionCard } from '@/components/admin/dashboard/QuickAction/quick-action-card'
import { QuickActions } from '@/components/admin/dashboard/QuickAction/quick-actions'
import SalesGoalCard from '@/components/admin/dashboard/salesGoal/sale-goal'
import {RecentActivity} from '@/components/admin/dashboard/recentActivity/recent-activity'
import OrderStatusCard from '../../../components/admin/dashboard/orderStatus/orderStatus'
import TopSellingProduct from '@/components/admin/dashboard/topSelling/top-sellingProduct'

import { ColumnConfig, DataTable } from '@/components/data-table/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye } from 'lucide-react'
import {useOrdersForAdminWithCount} from '@/hooks/queries/use-orders'
import { useRecentAuditLogs } from '@/hooks/queries/use-audit-logs'
import { useDashboardKpis } from '@/hooks/queries/use-dashboard-kpis'
// import {DataTable} from '@/components/data-table/data-table'



interface Product {
  sku: string;
  name: string;
  stock: number;
  isAvailable: boolean;
}

const mockProducts: Product[] = [
  { sku: "SKU-99", name: "Wireless Mouse", stock: 45, isAvailable: true },
  { sku: "SKU-100", name: "Mechanical Keyboard", stock: 0, isAvailable: false },
];

function Page() {

  const { data: ordersData, isLoading } = useOrdersForAdminWithCount();
  const { data: kpiData, isLoading: isKpiLoading, isError: isKpiError } = useDashboardKpis();
  const { data: recentActivityData, isLoading: isActivityLoading, isError: hasActivityError, } = useRecentAuditLogs({ limit: 6 });
  const recentActivity = recentActivityData?.logs ?? [];
  const kpiCards = [
    {
      title: "Revenue",
      value: isKpiError ? "Unavailable" : kpiData ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(kpiData.monthlyRevenue) : "₹0",
      description: "Delivered revenue this month",
      variant: "success" as const,
      badge: "This month",
    },
    {
      title: "Orders",
      value: isKpiError ? "Unavailable" : kpiData?.totalOrders.toLocaleString("en-IN") ?? "0",
      description: "Orders across all statuses",
      variant: "default" as const,
      badge: "All time",
    },
    {
      title: "Products",
      value: isKpiError ? "Unavailable" : kpiData?.totalProducts.toLocaleString("en-IN") ?? "0",
      description: "Products in inventory",
      variant: "warning" as const,
      badge: "Catalog",
    },
  ];


    
  const columns: ColumnConfig<Product>[] = [
    { header: "SKU", accessorKey: "sku", className: "font-mono text-xs", hideOnMobile: true },
    { header: "Product Name", accessorKey: "name", className: "font-medium" },
    {
      header: "Stock",
      cell: (row) => (
        <span className={row.stock === 0 ? "text-red-500 font-bold" : "text-green-600"}>
          {row.stock} units
        </span>
      ),
    },
    {
      header: "Availability",
      hideOnMobile: true,
      cell: (row) => (
        <Badge variant={row.isAvailable ? "default" : "destructive"}>
          {row.isAvailable ? "In Stock" : "Out of Stock"}
        </Badge>
      ),
    },
    {
      header: "Quick Actions",
      className: "text-right",
      // Different actions for products!
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" aria-label="View product">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View</span>
          </Button>
          <Button size="sm" aria-label="Edit product">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!isLoading && ordersData) {
      console.log("Orders Data:", ordersData);
    }
  }, [isLoading, ordersData]);


   return (
  <main className="flex w-full min-w-0 flex-col gap-4 p-3 sm:p-4 xl:flex-row xl:items-start">
    <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-1">
      <div className="w-full min-w-0">
        <KPIGrid>
          {kpiCards.map((item) => (
            <KPICard
              key={item.title}
              title={item.title}
              value={item.value}
              description={item.description}
              variant={item.variant}
              badge={item.badge}
              loading={isKpiLoading}
            />
          ))}
          {isKpiError && (
            <p role="alert" className="col-span-full px-2 text-sm text-destructive">
              Dashboard KPI data could not be loaded.
            </p>
          )}
        </KPIGrid>

        <div className="mt-3 w-full min-w-0">
          <AnalyticsCard />
        </div>

        <div className="mt-3 w-full min-w-0">
          <DataTable
            data={mockProducts}
            columns={columns}
            isSelectable={true}
            // selectedRowIds={selectedIds}
            // onSelectionChange={setSelectedIds}
            // getRowId={(row) => row.id}
          />
        </div>
      </div>
    </div>

    {/* right side */}
    <aside className="grid h-fit w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 xl:flex xl:w-[340px] xl:shrink-0 xl:flex-col">
      <div className="w-full">
        <SalesGoalCard goal={500000} currentSales={263460} />
      </div>

      <div className="w-full">
        <OrderStatusCard orderStatusData={ordersData ?? []} />
      </div>

      <div className="w-full">
        <QuickActions />
      </div>

      <div className="h-fit w-full">
        <RecentActivity
          activities={recentActivity}
          isLoading={isActivityLoading}
          hasError={hasActivityError}
        />
      </div>
    </aside>
  </main>
)
}

export default Page
