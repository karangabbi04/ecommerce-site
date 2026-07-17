"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ActivityItem from "./activity-item";
import { Activity } from "./dummydata";

interface ActivityTimelineProps {
  activities: Activity[];
  showSection?: boolean;
}

export default function ActivityTimeline({
  activities,
  showSection = false,
}: ActivityTimelineProps) {
  return (
    <div className="relative  rounded-xl p-4">

      {/* Timeline */}

      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-5">

        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            showSection={showSection}
          />
        ))}

      </div>

    </div>
  );
}