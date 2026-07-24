"use client";

import { useState } from "react";

import CartButton from "./CartButton";
import MiniCartContent from "./miniCartContent";

import { useCart } from "@/hooks/queries/cart";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CartDropdown() {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width:768px)");

  const { data: cartData } = useCart();

  const totalItems = cartData?.totalItems ?? 0;

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <CartButton totalItems={totalItems} />
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={12}
          className="w-105 overflow-hidden rounded-3xl border bg-background p-0 shadow-2xl"
        >
          <MiniCartContent />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
    
         <div>
            <CartButton totalItems={totalItems} />
          </div>
      
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="flex h-[90vh] max-h-[90vh] flex-col overflow-hidden rounded-t-3xl p-0"
      >
        <MiniCartContent />
      </SheetContent>
    </Sheet>
  );
}