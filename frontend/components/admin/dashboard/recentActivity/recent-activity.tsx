"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  FolderPen,
  PackagePlus,
  Pencil,
  Ticket,
  Trash2,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

import { Button } from "@/components/ui/button";
import type { AuditLogEntry } from "@/services/audit-log.service";
import ActivityTimeline from "./activity-timeline";
import type { Activity, ActivityCategory } from "./dummydata";

interface RecentActivityProps {
  activities: AuditLogEntry[];
  isLoading?: boolean;
  hasError?: boolean;
}

const actionPresentation: Record<string, { label: string; icon: LucideIcon; iconColor: string }> = {
  CREATE: { label: "created", icon: PackagePlus, iconColor: "bg-green-100 text-green-700" },
  UPDATE: { label: "updated", icon: Pencil, iconColor: "bg-blue-100 text-blue-700" },
  DELETE: { label: "deleted", icon: Trash2, iconColor: "bg-red-100 text-red-700" },
  STATUS_CHANGE: { label: "changed status", icon: BadgeDollarSign, iconColor: "bg-amber-100 text-amber-700" },
  LOGIN: { label: "logged in", icon: UserRound, iconColor: "bg-cyan-100 text-cyan-700" },
  LOGOUT: { label: "logged out", icon: UserRound, iconColor: "bg-slate-100 text-slate-700" },
};

const entityPresentation: Record<string, { label: string; category: ActivityCategory; icon: LucideIcon }> = {
  PRODUCT: { label: "product", category: "product", icon: PackagePlus },
  CATEGORY: { label: "category", category: "category", icon: FolderPen },
  COUPON: { label: "coupon", category: "coupon", icon: Ticket },
  ORDER: { label: "order", category: "settings", icon: BadgeDollarSign },
  USER: { label: "user", category: "settings", icon: UserRound },
  ADMIN: { label: "admin", category: "settings", icon: UserRound },
};

export function RecentActivity({ activities, isLoading = false, hasError = false }: RecentActivityProps) {
  const recentActivities: Activity[] = activities.slice(0, 6).map((entry) => {
    const action = actionPresentation[entry.action] ?? actionPresentation.UPDATE;
    const entity = entityPresentation[entry.entityType] ?? entityPresentation.ADMIN;
    const timestamp = new Date(entry.timestamp);

    return {
      id: entry.id,
      category: entity.category,
      title: `${entity.label} ${action.label}`,
      description: `${entry.entityName} · ${entry.adminEmail}`,
      badge: action.label,
      time: Number.isNaN(timestamp.getTime()) ? "" : formatDistanceToNowStrict(timestamp, { addSuffix: true }),
      createdAt: entry.timestamp,
      icon: entity.icon ?? action.icon,
      iconColor: action.iconColor,
      badgeVariant: entry.action === "DELETE" ? "destructive" : entry.action === "CREATE" ? "default" : "secondary",
    };
  });

  return (
    <section className="space-y-3 p-2 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Activity
          </h2>

          <p className="text-[12px] text-muted-foreground">
            Latest admin actions across your store.
          </p>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center gap-1">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">Loading activity...</p>
      ) : hasError ? (
        <p className="px-4 py-6 text-sm text-destructive">Could not load recent activity.</p>
      ) : recentActivities.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No recent activity.</p>
      ) : (
        <ActivityTimeline activities={recentActivities} />
      )}
    </section>
  );
}