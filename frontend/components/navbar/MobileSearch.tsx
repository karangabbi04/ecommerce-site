"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MobileSearch() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const value = search.trim();
    setOpen(false);

    router.push(
      value
        ? `/products?search=${encodeURIComponent(value)}`
        : "/products"
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>

        <Button
          size="icon"
          variant="ghost"
          className="lg:hidden"
        >
          <Search className="h-5 w-5" />
        </Button>

      </DialogTrigger>

      <DialogContent className="top-0 translate-y-0 rounded-b-3xl rounded-t-none p-6">

        <DialogTitle>
          Search Products
        </DialogTitle>

        <form
          onSubmit={handleSubmit}
          className="mt-5 flex gap-2"
        >
          <Input
            autoFocus
            value={search}
            placeholder="Search products..."
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <Button type="submit">
            Search
          </Button>

        </form>

      </DialogContent>

    </Dialog>
  );
}