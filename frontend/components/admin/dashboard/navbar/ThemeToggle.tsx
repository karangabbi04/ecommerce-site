"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import NavbarIconButton from "./NavbarIconButton";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const dark = resolvedTheme === "dark";

  return (
    <NavbarIconButton
      aria-label="Toggle Theme"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </NavbarIconButton>
  );
}