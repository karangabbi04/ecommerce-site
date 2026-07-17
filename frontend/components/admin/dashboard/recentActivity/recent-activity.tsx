"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import ActivityTimeline from "./activity-timeline";
import { activities } from "./dummydata";

export function RecentActivity() {
  // Show only latest 6 activities on dashboard
  const recentActivities = activities.slice(0, 6);

  return (
    <section className="space-y-3 p-2 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Activity
          </h2>

          <p className="text-sm text-muted-foreground">
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
      <ActivityTimeline activities={recentActivities} />
    </section>
  );
}