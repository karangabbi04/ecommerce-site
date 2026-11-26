"use client";

import SearchBox from "./SearchBox";
import NotificationButton from "./NotificationButton";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";



export default function Navbar() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div className="hidden min-w-0 flex-1 md:block">
        <SearchBox className="max-w-xl" />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <NotificationButton />
        <ThemeToggle />
        <UserMenu />
      </div>
    </div>
  );
}