"use client";

import React from 'react'
import { useState } from 'react';
import AnalyticsSelect from './AnalyticsSelect';
import { metricOptions,dateOptions,chartOptions } from './options';
import AnalyticsChart from './AnalyticsChart';


const data = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 30000 },
  { month: "Jun", revenue: 25000 },
  { month: "jul", revenue: 25000 },
  { month: "aug", revenue: 23000 },
  { month: "sep", revenue: 25000 },
  { month: "oct", revenue: 22000 },
  { month: "nov", revenue: 20000 },
  { month: "dec", revenue: 56000 },
];




function AnalyticsCard() {

      const [metric, setMetric] = useState("revenue");

  const [dateRange, setDateRange] = useState("thisMonth");

const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");



    return (
        <main className='flex w-full h-full bg-gray-800 rounded-2xl flex-wrap p-4'>
            <div className='w-full h-12 flex justify-between  flex-3'>
                <AnalyticsSelect
                    value={metric}
                    options={metricOptions}
                    onChange={setMetric}
                />
                      <AnalyticsSelect
                        value={dateRange}
                        options={dateOptions}
                        onChange={setDateRange}
                    />
                <AnalyticsSelect
                    value={chartType}
                    options={chartOptions}
                    onChange={(value) =>
                      setChartType(value as "line" | "bar" | "area")
                    }
                />
             </div>

            <div className='w-full h-fit'>
                     <AnalyticsChart
                        type={chartType}
                        data={data}
                        dataKey={metric}
                    />
            </div>
        </main>
    )
}

export default AnalyticsCard
