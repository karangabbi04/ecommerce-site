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
      <Card className={cn("rounded-2xl border", className)}>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
          </div>

          <div className="h-9 w-36 animate-pulse rounded bg-muted" />

          <div className="flex items-center gap-2">
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group  rounded-xl  bg-gray-100 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <CardContent className="space-y-2 px-7">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            {badge && (
              <Badge
                variant="secondary"
                className="rounded-full px-2 py-0 text-[11px]"
              >
                {badge}
              </Badge>
            )}
          </div>

          <div
            className={cn(
              iconContainerVariants({ variant }),
              "transition-transform duration-300 group-hover:scale-110"
            )}
          >
            {/* <Icon className="h-6 w-6" /> */}
          </div>
        </div>

        {/* Value */}
        <h2 className="text-2xl font-bold tracking-tight">{value}</h2>

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