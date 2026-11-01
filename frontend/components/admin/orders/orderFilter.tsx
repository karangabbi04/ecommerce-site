"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarIcon, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// TypeScript Types
type DatePreset = "all" | "today" | "yesterday" | "last_7" | "last_30" | "custom";

export function OrderFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [status, setStatus] = useState<string>(
    searchParams.get("status")?.toUpperCase() || "ALL"
  );
  const [datePreset, setDatePreset] = useState<DatePreset>(
    (searchParams.get("date_preset") as DatePreset) || "all"
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: searchParams.get("start_date")
      ? new Date(searchParams.get("start_date")!)
      : undefined,
    to: searchParams.get("end_date")
      ? new Date(searchParams.get("end_date")!)
      : undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", "1");

    if (status && status !== "ALL") params.set("status", status.toUpperCase());

    if (datePreset && datePreset !== "all") {
      params.set("date_preset", datePreset);
    }

    if (datePreset === "custom" && dateRange?.from) {
      params.set("start_date", format(dateRange.from, "yyyy-MM-dd"));
      if (dateRange.to) {
        params.set("end_date", format(dateRange.to, "yyyy-MM-dd"));
      }
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl as any, { scroll: false });
  }, [status, datePreset, dateRange, pathname, router]);

  const handleReset = () => {
    setStatus("ALL");
    setDatePreset("all");
    setDateRange(undefined);
  };

  return (
    <Card className="border-border/50 shadow-sm bg-muted/10">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1 w-full lg:w-auto">
            <Label className="mb-1.5 block text-sm font-medium text-muted-foreground">
              Order Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value.toUpperCase())}
            >
              <SelectTrigger className="w-full lg:w-45 bg-background">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PACKED">Packed</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 w-full lg:w-auto">
            <Label className="mb-1.5 block text-sm font-medium text-muted-foreground">
              Date Range
            </Label>
            <Select
              value={datePreset}
              onValueChange={(val) => {
                setDatePreset(val as DatePreset);
                if (val !== "custom") setDateRange(undefined);
              }}
            >
              <SelectTrigger className="w-full lg:w-45 bg-background">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last_7">Last 7 Days</SelectItem>
                <SelectItem value="last_30">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {datePreset === "custom" && (
            <div className="flex-1 w-full lg:w-auto">
              <Label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                Select Dates
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full lg:w-60 justify-start text-left font-normal bg-background",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
                 