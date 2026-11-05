"use client";

import Link from "next/link";
import type { Route } from "next";
import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import CartDropdown from "../cart/CartDropdown";

import { useAuthStore } from "@/store/auth.store";
import MobileMenu from "./MobileMenu";
import MobileSearch from "./MobileSearch";
interface NavbarActionsProps {
  onMenuClick: () => void;
}

export default function NavbarActions({
  onMenuClick,
}: NavbarActionsProps) {
  const user = useAuthStore((state) => state.user);
  const initials = user?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "";

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <Link
          href={"/account" as Route}
          aria-label={`Open ${user.name}'s account`}
          title={`${user.name} (${user.email})`}
          className="hidden max-w-48 items-center gap-2 rounded-full border bg-background px-2 py-1.5 transition-colors hover:bg-muted lg:flex"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials || <UserRound className="size-4" aria-hidden="true" />}
          </span>
          <span className="truncate pr-2 text-sm font-medium">{user.name}</span>
        </Link>
      ) : (
        <Button asChild className="hidden lg:inline-flex">
          <Link href="/auth/login">Login</Link>
        </Button>
      )}

      {/* Cart */}

      <CartDropdown />
        <MobileSearch/>
      {/* Mobile Menu */}

      <MobileMenu />

    </div>
  );
}