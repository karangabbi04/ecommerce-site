"use client";

import { memo } from "react";

import type { Stat } from "./types";

interface StatCardProps {
  stat: Stat;
}

export const StatCard = memo(function StatCard({
  stat,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
      <p className="text-3xl font-semibold">
        {stat.value}
      </p>

      <p className="mt-1 text-sm text-zinc-300">
        {stat.label}
      </p>
    </div>
  );
});