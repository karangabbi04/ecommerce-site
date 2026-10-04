// src/components/tracking/TrackingTimeline.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { Package, Box, Truck, MapPin, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils"; // shadcn ki utility function

interface TrackingTimelineEntry {
  id: string;
  status: string;
  note: string | null;
  createdAt: string | Date;
}

interface TrackingTimelineProps {
  steps?: TrackingTimelineEntry[];
}

const iconMap = {
  package: Package,
  box: Box,
  truck: Truck,
  "map-pin": MapPin,
  "check-circle": CheckCircle2,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

export function TrackingTimeline({ steps }: TrackingTimelineProps) {
  const timelineSteps = Array.isArray(steps) ? steps : [];

  if (!timelineSteps.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No shipment updates available yet.
      </p>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative w-full max-w-3xl mx-auto"
    >
      {timelineSteps.map((step, index) => {
        const normalizedStatus = step.status.toLowerCase();
        const icon = normalizedStatus.includes("deliver")
          ? "check-circle"
          : normalizedStatus.includes("ship") || normalizedStatus.includes("out_for")
            ? "truck"
            : normalizedStatus.includes("pack")
              ? "box"
              : normalizedStatus.includes("confirm")
                ? "map-pin"
                : "package";
        const Icon = iconMap[icon];
        const isLast = index === timelineSteps.length - 1;
        const displayStatus = isLast ? "current" : "completed";
        const timestamp = new Date(step.createdAt);
        const title = step.status.replaceAll("_", " ");

        return (
          <motion.div
            key={step.id}
            variants={itemVariants}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {/* Connecting Line */}
            {!isLast && (
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-border">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: displayStatus === "completed" ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className={cn(
                    "w-full h-full origin-top bg-primary",
                  )}
                />
              </div>
            )}

            {/* Icon Node */}
            <div className="relative z-10 shrink-0">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  displayStatus === "completed" && "bg-primary border-primary text-primary-foreground",
                  displayStatus === "current" && "bg-primary/10 border-primary text-primary ring-4 ring-primary/20"
                )}
              >
                <Icon className="w-5 h-5" />
                {/* Pulse effect for current step */}
                {displayStatus === "current" && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h3 className={cn(
                  "font-semibold text-base",
                  "text-foreground"
                )}>
                  {title}
                </h3>
                <span className="text-xs text-muted-foreground font-medium">
                  {Number.isNaN(timestamp.getTime())
                    ? ""
                    : timestamp.toLocaleString()}
                </span>
              </div>
              <p className={cn(
                "text-sm mt-0.5",
                "text-muted-foreground"
              )}>
                {step.note || `Order status changed to ${title.toLowerCase()}.`}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}