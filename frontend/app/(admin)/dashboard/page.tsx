import React from 'react'
import AnalyticsCard from '@/components/admin/dashboard/analytics/AnalyticsCard'
import {KPICard} from '@/components/admin/dashboard/KPI-card/KPICard'
import { dashboardKPI } from '@/components/admin/dashboard/KPI-card/dummydata'
import { KPIGrid } from '@/components/admin/dashboard/KPI-card/KPIGrid'
import { QuickActionCard } from '@/components/admin/dashboard/QuickAction/quick-action-card'
import { QuickActions } from '@/components/admin/dashboard/QuickAction/quick-actions'
import SalesGoalCard from '@/components/admin/dashboard/salesGoal/sale-goal'
import {RecentActivity} from '@/components/admin/dashboard/recentActivity/recent-activity'
import OrderStatusCard from '@/components/admin/dashboard/orderStatus/orderStatus'
import TopSellingProduct from '@/components/admin/dashboard/topSelling/top-sellingProduct'
import ProductTable from '@/components/products-for-table/product-table'
import {DataTable} from '@/components/data-table/data-table'


interface Props {}

function Page(props: Props) {
    const {} = props

    return (
        <main className=' flex justify-between w-full   rounded-xl'>
{/* left side */}
           <div className=' flex flex-wrap w-[65%] gap-4 px-4 '>
             <div className='w-full bg-gray-400 h-fit px-1 '>
                        <KPIGrid>
                        {dashboardKPI.map((item) => (
                            <KPICard
                            key={item.title}
                            title={item.title}
                            value={item.value}
                            trend={item.trend}
                            description={item.description}
                            variant={item.variant}
                            badge={item.badge}
                            />
                         ))}
                        </KPIGrid>
                        <AnalyticsCard/>



                <div className='w-full h-fit bg-gray-200 '>
                    <ProductTable/>
                 </div>
                </div>
           </div>

           {/* // right side */}
              <div className='w-[20%] h-fit p-4 rounded-xl'>

                 <div>
                <OrderStatusCard/>
            </div>

                <div className="">
                    <SalesGoalCard
                    goal={500000}
                currentSales={50000}
                />
              </div>
                <div className='px-2 '>
                        <QuickActions/>
                    </div>

                        <div className='bg-lime-400 w-fit h-fit'><RecentActivity/></div>


                 </div>
        </main>
    )
}

export default Page
