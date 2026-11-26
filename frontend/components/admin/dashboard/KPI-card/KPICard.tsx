"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const iconContainerVariants = cva(
  "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
        warning:
          "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
        danger:
          "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface KPICardProps
  extends VariantProps<typeof iconContainerVariants> {
  title: string;
  value: string | number;
  

  trend?: number;
  trendLabel?: string;

  description?: string;

  badge?: string;

  loading?: boolean;

  className?: string;
}

export function KPICard({
  title,
  value,
  trend,
  trendLabel = "vs last month",
  description,
  badge,
  loading = false,
  variant,
  className,
}: KPICardProps) {
  const isPositive = (trend ?? 0) >= 0;

  if (loading) {
    return (
      <Card className={cn("min-w-0 rounded-lg border py-2 sm:rounded-2xl sm:py-4", className)}>
        <CardContent className="space-y-2 px-2 sm:space-y-3 sm:p-4">
          <div className="h-3 w-12 animate-pulse rounded bg-muted sm:h-4 sm:w-24" />
          <div className="h-4 w-full animate-pulse rounded bg-muted sm:h-9 sm:w-36" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group min-w-0 rounded-lg border bg-gray-100 py-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-xl sm:py-4",
        className
      )}
    >
      <CardContent className="space-y-1 px-2 sm:space-y-2 sm:px-5">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-[11px] font-medium text-muted-foreground sm:text-sm">
              {title}
            </p>

            {badge && (
              <Badge
                variant="secondary"
                className="hidden rounded-full px-2 py-0 text-[11px] sm:inline-flex"
              >
                {badge}
              </Badge>
            )}
          </div>

          <div
            className={cn(
              iconContainerVariants({ variant }),
              "hidden transition-transform duration-300 group-hover:scale-110 sm:flex"
            )}
          >
            {/* <Icon className="h-6 w-6" /> */}
          </div>
        </div>

        <h2 className="text-[13px] leading-tight font-bold tracking-tight break-words sm:text-2xl">{value}</h2>

        {/* Trend */}
        {trend !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <div
              className={cn(
                "flex items-center gap-1 font-semibold",
                isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}

              {Math.abs(trend)}%
            </div>

            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        )}

        {/* Description
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )} */}
      </CardContent>
    </Card>
  );
}