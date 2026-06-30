"use client";

import { Bell } from "lucide-react";
import NavbarIconButton from "./NavbarIconButton";

export default function NotificationButton() {
  return (
    <NavbarIconButton aria-label="Notifications">

      <Bell className="h-5 w-5" />

      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-ping" />

    </NavbarIconButton>
  );
}