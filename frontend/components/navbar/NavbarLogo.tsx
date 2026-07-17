"use client";

import Link from "next/link";

export default function NavbarLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 transition-opacity hover:opacity-90"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-lg font-bold text-white">
        V
      </div>

      <div className="hidden sm:block">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-950">
          VetriGlass
        </h1>

        <p className="text-xs text-muted-foreground">
          Recycled Glass Craft
        </p>
      </div>
    </Link>
  );
}