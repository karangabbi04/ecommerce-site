import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity } from "./dummydata";

interface ActivityItemProps {
  activity: Activity;
  showSection?: boolean;
}

export default function ActivityItem({
  activity,
  showSection = false,
}: ActivityItemProps) {
  const Icon = activity.icon;

  return (
    <div className="relative flex gap-2">
      {/* Timeline Icon */}
      <div
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
          activity.iconColor
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Card */}
      <div className="flex-1   rounded-xl border  p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">

        {showSection && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {}
          </p>
        )}

        <div className="flex w-full items-start justify-between  gap-3">

          <div className=" w-full">

            <div className=" flex  justify-between  font-semibold text-[12px] w-full">
              <span >{activity.title}</span> 
              <span >{activity.time}</span>
            </div>

            <p className="mt-1 text-[13px] text-muted-foreground">
              {activity.description}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}