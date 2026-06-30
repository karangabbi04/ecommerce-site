"use client";

import Logo from "./logo";
import SearchBox from "./SearchBox";
import NotificationButton from "./NotificationButton";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";



export default function Navbar() {
  return (
    <header className="  w-full sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-2 px-6">

        {/* Left */}
        <div className="flex items-center gap-8">
        </div>

        {/* Center */}
        <div className="hidden flex-1 justify-center lg:flex">
          <SearchBox />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <NotificationButton />
          <ThemeToggle />
          <UserMenu />
        </div>

      </div>
    </header>
  );
}