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
        <section className="flex w-full min-w-0 flex-col gap-3 rounded-2xl bg-card p-3 text-card-foreground ring-1 ring-border sm:p-4">
            {/* Options — always in one row, wrap on very small screens */}
            <div className="flex w-full flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[120px]">
                    <AnalyticsSelect
                        value={metric}
                        options={metricOptions}
                        onChange={setMetric}
                    />
                </div>
                <div className="flex-1 min-w-[130px]">
                    <AnalyticsSelect
                        value={dateRange}
                        options={dateOptions}
                        onChange={setDateRange}
                    />
                </div>
                <div className="flex-1 min-w-[100px]">
                    <AnalyticsSelect
                        value={chartType}
                        options={chartOptions}
                        onChange={(value) =>
                            setChartType(value as "line" | "bar" | "area")
                        }
                    />
                </div>
            </div>

            {/* Chart — centered */}
            <div className="relative mx-auto h-60 w-full min-w-0 sm:h-80">
                {isLoading ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">Loading analytics...</p>
                ) : isError ? (
                    <p role="alert" className="py-8 text-center text-sm text-destructive">
                        Could not load revenue analytics.
                    </p>
                ) : (
                    <div className="absolute inset-0">
                        <AnalyticsChart
                            type={chartType}
                            data={data ?? []}
                            dataKey={metric}
                        />
                    </div>
                )}
            </div>
        </section>
    )
}

export default AnalyticsCard
