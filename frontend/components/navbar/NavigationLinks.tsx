"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_LINKS = [
  {
    label: "Products",
    href: "/",
  },
  {
    label: "About",
    href: "/",
  },
  {
    label: "Contact",
    href: "/",
  },
];

export default function NavigationLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {NAV_LINKS.map((item) => (
        <Link
          key={item.href}
          href="/"
          className={clsx(
            "text-sm font-medium transition-colors",
            pathname === item.href
              ? "text-zinc-950"
              : "text-muted-foreground hover:text-zinc-950"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}