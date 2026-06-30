"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchBoxProps = {
  className?: string;
  placeholder?: string;
};

export default function SearchBox({
  className,
  placeholder = "                Search products, orders, customers...",
}: SearchBoxProps) {
  return (
    <div
      className={cn(
        "group relative w-full max-w-2xl",
        className
      )}
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
      />

      <input
        type="text"
        placeholder={placeholder}
        aria-label="Search"
        className="
          h-11
          w-full
          rounded-xl
          border
          border-border
          bg-background/70
          pl-11
          pr-20
          text-sm
          outline-none
          backdrop-blur
          transition-all
          duration-200
          placeholder:text-muted-foreground
          hover:border-border/80
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
        "
      />

      <kbd
        className="
          absolute
          right-7
          top-1/2
          -translate-y-1/2
          rounded-md
          border
          bg-muted
          px-2
          py-1
          text-[10px]
          font-medium
          text-muted-foreground
         
        "
      >
        Ctrl
        <span>+</span>
        K
      </kbd>
    </div>
  );
}