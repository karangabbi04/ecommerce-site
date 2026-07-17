"use client";

import { Menu, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

import CartDropdown from "../cart/CartDropdown";

import { useAuthStore } from "@/store/auth.store";
import MobileMenu from "./MobileMenu";
import MobileSearch from "./MobileSearch";
interface NavbarActionsProps {
  onMenuClick: () => void;
}

export default function NavbarActions({
  onMenuClick,
}: NavbarActionsProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center gap-2">

      {/* Desktop Location */}

      <Button
        variant="outline"
        className="hidden lg:flex"
      >
        <MapPin className="mr-2 h-4 w-4" />

        Ludhiana, PB

      </Button>

      {/* Desktop User */}

      <Button
        variant={user ? "secondary" : "default"}
        className="hidden lg:flex"
      >
        {user ? user.name : "Login"}
      </Button>

      {/* Cart */}

      <CartDropdown />
        <MobileSearch/>
      {/* Mobile Menu */}

      <MobileMenu />

    </div>
  );
}