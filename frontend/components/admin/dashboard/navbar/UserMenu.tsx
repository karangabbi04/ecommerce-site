"use client";

import { LogOut, Shield, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminSession } from "@/hooks/queries/use-admin-session";

export default function UserMenu() {
  const { user, isLoading, isLoggingOut, logout } = useAdminSession();
  const displayName = user?.name || "Admin";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open admin account menu"
          className="flex size-10 items-center justify-center rounded-full border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {isLoading && !user ? "Loading admin..." : displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserRound aria-hidden="true" />
          <span>Account</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {user?.role ?? "ADMIN"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Shield aria-hidden="true" />
          <span>Administrator access</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isLoggingOut}
          onSelect={logout}
        >
          <LogOut aria-hidden="true" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
