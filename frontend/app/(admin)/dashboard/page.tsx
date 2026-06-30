import React from 'react'
import AnalyticsCard from '@/components/admin/dashboard/analytics/AnalyticsCard'
import {KPICard} from '@/components/admin/dashboard/KPI-card/KPICard'
import { dashboardKPI } from '@/components/admin/dashboard/KPI-card/dummydata'
import { KPIGrid } from '@/components/admin/dashboard/KPI-card/KPIGrid'
import { QuickActionCard } from '@/components/admin/dashboard/QuickAction/quick-action-card'

import { quickActions } from '@/components/admin/dashboard/QuickAction/action'

interface Props {}

function Page(props: Props) {
    const {} = props

    return (
        <main className=' flex flex-wrap gap-4'>

            <div className='h-96 w-full'>
                <AnalyticsCard/>
            </div>
                    <div className='w-fit'>
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
                    </div>

            <div className='w-54 '>
               {quickActions.map((item) => (
                <QuickActionCard
                    key={item.id}
                    action={item}
                />
               ))}
            </div>

        </main>
    )
}

export default Page
