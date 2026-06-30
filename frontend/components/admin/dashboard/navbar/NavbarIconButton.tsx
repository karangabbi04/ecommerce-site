"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavbarIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const NavbarIconButton = forwardRef<
  HTMLButtonElement,
  NavbarIconButtonProps
>(({ children, className, active = false, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        `
        relative
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        border-border/70
        bg-background/70
        backdrop-blur-xl

        transition-all
        duration-200

        hover:bg-accent
        hover:border-border
        hover:scale-105

        active:scale-95

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/30
        `,
        active &&
          `
          bg-primary/10
          text-primary
          border-primary/30
        `,
        className
      )}
    >
      {children}
    </button>
  );
});

NavbarIconButton.displayName = "NavbarIconButton";

export default NavbarIconButton;