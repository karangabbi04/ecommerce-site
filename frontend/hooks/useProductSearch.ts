"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function useProductSearch() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const handleSearch = (
    e?: FormEvent<HTMLFormElement>
  ) => {
    e?.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/products");
      return;
    }

    router.push(
      `/products?search=${encodeURIComponent(value)}`
    );
  };

  return {
    search,
    setSearch,
    handleSearch,
  };
}