"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ProductHero,
  ProductFilters,
  ProductGrid,
  ProductPagination,
  ProductStats,
} from "@/components/products";

import { useProducts } from "@/hooks/queries/use-products";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Read values from URL
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setCategory(searchParams.get("category") ?? "");
    setSort(searchParams.get("sort") ?? "newest");
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (page !== 1) params.set("page", String(page));

    const query = params.toString();

    router.replace(query ? `/products?${query}` : "/products");
  }, [debouncedSearch, category, sort, page, router]);

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useProducts({
    page,
    limit: 12,
    search: debouncedSearch,
    category,
    sort,
  });

  return (
    <main>
      <ProductHero
        totalProducts={data?.pagination.totalProducts ?? 0}
      />

      <section className="w-full px-4 py-16 space-y-10">
        <ProductStats
          total={data?.pagination.totalProducts ?? 0}
        />

        <ProductFilters
          search={search}
          category={category}
          sort={sort}
          onSearchChange={setSearch}
          onCategoryChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
          onSortChange={(value) => {
            setSort(value);
            setPage(1);
          }}
        />

        <ProductGrid
          products={data?.products ?? []}
          isLoading={isLoading}
          isFetching={isFetching}
          error={error}
        />

        {data?.pagination && (
          <ProductPagination
            pagination={data.pagination}
            onPageChange={setPage}
          />
        )}
      </section>
    </main>
  );
}