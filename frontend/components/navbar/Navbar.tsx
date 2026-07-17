"use client";
import { useState } from "react";
import NavbarLogo from "./NavbarLogo";
import NavigationLinks from "./NavigationLinks";
import NavbarSearch from "./NavbarSearch";
import NavbarActions from "./NavbarAction";

export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto">

        <div className="flex h-20 items-center justify-between gap-6">

          {/* Left */}

          <div className="flex items-center gap-10">

            <NavbarLogo />

            <NavigationLinks />

          </div>

          {/* Center */}

          <div className="flex flex-1 justify-center px-4">

            <NavbarSearch />

          </div>

          {/* Right */}

          <NavbarActions
                onMenuClick={() =>
                    setIsMenuOpen(true)
                }
            />

        </div>

      </div>
    </header>
  );
}