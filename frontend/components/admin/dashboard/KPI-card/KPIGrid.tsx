import * as React from "react";

import { cn } from "@/lib/utils";

interface KPIGridProps {
  children: React.ReactNode;
  className?: string;
}

export function KPIGrid({ children, className }: KPIGridProps) {
  return (
    <section
      aria-label="Key Performance Indicators"
      className={cn(
        "grid gap-4 p-2 border-2 w-fit rounded-4xl ",
        "grid-cols-1",
        "sm:grid-cols-2",
        "xl:grid-cols-4 flex flex-wrap",
        className
      )}
    >
      {children}
    </section>
  );
}