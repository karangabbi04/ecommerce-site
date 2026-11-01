// components/admin/dashboard/QuickAction/quick-action-card.tsx
"use client";

import { ArrowUpRight } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuickAction, ModalAction } from "./types";

interface QuickActionCardProps {
  action: QuickAction;
  onClick: (actionType: ModalAction) => void; // <-- onClick handler add kiya
}

export function QuickActionCard({ action, onClick }: QuickActionCardProps) {
  const Icon = action.icon;

  return (
    // Link ki jagah button use kiya for accessibility and no-navigation
    <button
      onClick={() => onClick(action.actionType)}
      className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <Card
        className={cn(
          "relative w-full h-32 py-3 px-4 bg-card overflow-hidden border transition-all duration-300",
          "hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
          "active:scale-95" // Mobile pe tap ka feel dene ke liye
        )}
      >
        <CardHeader className="space-y-2 p-0 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                action.color
              )}
            >
              <Icon className="h-4 w-4" />
            </div>

            <ArrowUpRight
              className={cn(
                "h-5 w-5 text-muted-foreground transition-all duration-300",
                "opacity-0 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
              )}
            />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold leading-tight">
              {action.title}
            </CardTitle>
            <CardDescription className="text-xs line-clamp-2">
              {action.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </button>
  );
}