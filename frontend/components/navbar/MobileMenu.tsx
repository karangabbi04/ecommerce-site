"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  MapPin,
  LogIn,
  User,
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
import { Route } from "next";

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

            <Button
              className="w-full justify-start"
              variant={
                user
                  ? "secondary"
                  : "default"
              }
            >
              {user ? (
                <>
                  <User className="mr-2 h-4 w-4" />

                  {user.name}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />

                  Login
                </>
              )}
            </Button>

          </div>

        </div>

      </SheetContent>

    </Sheet>
  );
}