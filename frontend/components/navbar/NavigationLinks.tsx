"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_LINKS = [
  {
    label: "Products",
       href: "/products?sort=newest",

  },
  {
    label: "About",
        href: "/products",

  },
  {
    label: "Contact",
    href: "/products",
  },
];

export default function NavigationLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {NAV_LINKS.map((item) => (
        <Link
          key={item.href}
          href="/products?sort=newest"
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