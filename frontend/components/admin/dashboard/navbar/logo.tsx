"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg transition duration-300 group-hover:scale-105">
        <Shield size={20} />
      </div>

      <div className="hidden sm:block">
        <h2 className="text-base font-bold tracking-tight">
          Admin Dashboard
        </h2>

        <p className="text-xs text-muted-foreground">
          Ecommerce Management
        </p>
      </div>
    </Link>
  );
}