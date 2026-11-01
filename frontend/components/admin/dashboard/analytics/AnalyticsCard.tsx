"use client";

import { useState } from 'react';
import AnalyticsSelect from './AnalyticsSelect';
import { metricOptions,dateOptions,chartOptions } from './options';
import AnalyticsChart from './AnalyticsChart';
import { useanalytics } from '@/hooks/queries/use-analytics';


function AnalyticsCard() {

    const [metric, setMetric] = useState("revenue");
    const [dateRange, setDateRange] = useState("thisMonth");
    const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
    const { data, isError, isLoading } = useanalytics(dateRange);

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
                            {isLoading ? (
                                <p className="py-8 text-center text-sm text-slate-300">Loading analytics...</p>
                            ) : isError ? (
                                <p role="alert" className="py-8 text-center text-sm text-red-300">
                                    Could not load revenue analytics.
                                </p>
                            ) : (
                                <AnalyticsChart
                                    type={chartType}
                                    data={data ?? []}
                                    dataKey={metric}
                                />
                            )}
            </div>
        </main>
    )
}

export default AnalyticsCard
