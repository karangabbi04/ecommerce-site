"use client";
import { use } from "react";
import { quickActions } from "./action";
import { QuickActionCard } from "./quick-action-card";

export function QuickActions() {
  return (
    <section className="space-y-5 pt-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Quick Actions
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 p-4  ">
        {quickActions.map((action) => (
          <QuickActionCard
            key={action.id}
            action={action}
          />
        ))}
      </div>
    </section>
  );
}