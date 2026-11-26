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
        "grid w-full grid-cols-3 gap-2 sm:gap-3 xl:grid-cols-3",
        className
      )}
    >
      {children}
    </section>
  );
}