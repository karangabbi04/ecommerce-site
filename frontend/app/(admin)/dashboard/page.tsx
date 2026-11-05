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
    { header: "SKU", accessorKey: "sku", className: "font-mono text-xs" },
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
          <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" /> View</Button>
          <Button size="sm"><Edit className="h-4 w-4 mr-1" /> Edit</Button>
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
        <main className=' flex justify-between w-full   rounded-xl'>
{/* left side */}
           <div className=' flex flex-wrap w-[65%] gap-4 px-4 '>
             <div className='w-full h-fit px-1 '>
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



                       <div className='w-full h-fit mt-2     '>
                          <AnalyticsCard/>
                       </div>



                <div className='w-full h-fit mt-2 '>
                          <DataTable
                                 data={mockProducts}
                                 columns={columns}
                                 isSelectable={true}
                                //  selectedRowIds={selectedIds}
                                //  onSelectionChange={setSelectedIds}
                                //  getRowId={(row) => row.id}
                               />
                 </div>
                </div>
           </div>

           {/* // right side */}
              <div className='w-[35%] h-fit p-2 rounded-xl ' >
                
                <div className=" mb-4">
                    <SalesGoalCard
                    goal={500000}
                currentSales={263460}
                />
              </div>
                 <div className=' w-full'>
                    <OrderStatusCard
                      orderStatusData={ordersData ?? []}
                />
            </div>

                
                <div className=' w-full '>
                        <QuickActions/>
                    </div>

                        <div className=' w-fit h-fit'>
                          <RecentActivity
                            activities={recentActivity}
                            isLoading={isActivityLoading}
                            hasError={hasActivityError}
                          />
                        </div>


                 </div>
        </main>
    )
}

export default Page
