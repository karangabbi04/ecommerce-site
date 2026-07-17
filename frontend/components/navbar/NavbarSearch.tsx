"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductSearch } from "@/hooks/useProductSearch";

export default function NavbarSearch() {
  const router = useRouter();
const {

search,

setSearch,

handleSearch

}=useProductSearch();



  return (
    <form
      onSubmit={handleSearch}
      className="hidden w-full max-w-md lg:block"
    >
      <div className="relative">

        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          placeholder="Search handmade glass products..."
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 rounded-full pl-11 pr-12"
        />

        <Button
          type="submit"
          size="icon"
          className="absolute right-1 top-1 h-9 w-9 rounded-full"
        >
          <Search className="h-4 w-4" />
        </Button>

      </div>
    </form>
  );
}