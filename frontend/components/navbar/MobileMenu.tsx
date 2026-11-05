"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  MapPin,
  LogIn,
  UserRound,
  Package,
  Phone,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAuthStore } from "@/store/auth.store";
import type { Route } from "next";

const links = [
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "About",
    href: "/about",
    icon: Info,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Phone,
  },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const initials = user?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>

        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[320px]"
      >
        <SheetHeader>

          <SheetTitle>
            VetriGlass
          </SheetTitle>

        </SheetHeader>

        <div className="mt-8 space-y-6">

          <Button
            variant="outline"
            className="w-full justify-start"
          >
            <MapPin className="mr-2 h-4 w-4" />

            Ludhiana, PB

          </Button>

          <nav className="space-y-2">

            {links.map((item) => {
              const Icon = item.icon;

              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link
                    href={item.href as Route}
                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    <Icon className="mr-2 h-4 w-4" />

                    {item.title}

                  </Link>
                </Button>
              );
            })}

          </nav>

          <div className="border-t pt-6">

            {user ? (
              <Link
                href={"/account" as Route}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-md border bg-muted/40 p-3 transition-colors hover:bg-muted"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials || <UserRound className="size-4" aria-hidden="true" />}
                </span>
                <span className="min-w-0 text-left">
                  <span className="block truncate text-sm font-medium">{user.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                </span>
              </Link>
            ) : (
              <Button asChild className="w-full justify-start">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}

          </div>

        </div>

      </SheetContent>

    </Sheet>
  );
}