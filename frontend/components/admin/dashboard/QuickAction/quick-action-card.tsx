import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import type { QuickAction } from "./types";

interface QuickActionCardProps {
  action: QuickAction;
}

export function QuickActionCard({ action }: QuickActionCardProps) {
  const Icon = action.icon;

  return (
    <Link href="/" className="group block">
      <Card
        className={cn(
          "relative w-30 h-32 py-2 px-0 bg-gray-100 overflow-hidden border transition-all duration-300",
          "hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg",
          "focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-xl transition-colors",
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
            <CardTitle className="text-base text-[14px] font-semibold">
              {action.title}
            </CardTitle>

            <CardDescription className="text-[12px]">
              {action.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}