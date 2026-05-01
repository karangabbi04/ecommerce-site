"use client";

import { use, useMemo, useState } from "react";
import { useEffect } from "react";
import { useProductStore } from "@/app/store/product.store";

import type { SVGProps } from "react";

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SlidersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 21v-7" />
      <path d="M4 10V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-5" />
      <path d="M20 12V3" />
      <path d="M2 14h4" />
      <path d="M10 8h4" />
      <path d="M18 16h4" />
    </svg>
  );
}

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ShoppingBagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

type ProductCategory = "All" | "Glassware" | "Decor" | "Lighting" | "Tableware";




const categories: ProductCategory[] = ["All", "Glassware", "Decor", "Lighting", "Tableware"];

export default function Page() {

  const products = useProductStore((state) => state.products);
    const fetchProducts = useProductStore((state) => state.fetchProducts);



  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory>("All");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sort === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sort]);


    useEffect(() => {
      // Fetch products from the store (which in turn fetches from the API)
      fetchProducts()
    }, [fetchProducts]); 

    console.log("Products in store:", products);

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-[#f5f5f7] via-white to-[#f5f5f7] text-zinc-950">
      <section className="relative px-6 pb-12 pt-24">
        <div className="absolute left-[-10rem] top-20 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-[-10rem] top-40 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Shop Collection
            </p>
            <h1 className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
              Handmade products with a second life.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Explore premium glassware, decor, lighting, and tableware crafted from recycled bottles.
            </p>
          </div>

          <div className="mt-12 rounded-[2rem] border border-white/80 bg-white/60 p-4 shadow-xl shadow-zinc-900/5 backdrop-blur-2xl">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
              <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3">
                <SearchIcon className="h-4 w-4 text-zinc-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full px-4 py-3 text-sm font-medium transition ${
                      category === item
                        ? "bg-zinc-950 text-white"
                        : "bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-3">
                <SlidersIcon className="h-4 w-4 text-zinc-400" />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="bg-transparent text-sm outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Showing <span className="font-semibold text-zinc-950">{products.length}</span> products
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-900/10 before:pointer-events-none before:absolute before:inset-y-0 before:left-[-120%] before:z-20 before:w-1/2 before:skew-x-[-18deg] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent before:transition-all before:duration-700 hover:before:left-[140%]"
              >
                <div className={`relative flex h-64 items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br `}>
                  <div className="absolute inset-6 rounded-[1.5rem] border border-white/70 bg-white/35 backdrop-blur-xl" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur-xl">
                   
                  </div>

                  <div className="relative h-36 w-20 rounded-b-[2.25rem] rounded-t-2xl border border-white/90 bg-white/45 shadow-2xl backdrop-blur-md transition duration-300 group-hover:scale-105">
                    <div className="absolute left-1/2 top-[-2.2rem] h-11 w-9 -translate-x-1/2 rounded-t-xl border border-white/90 bg-white/60" />
                    <div className="absolute left-4 top-6 h-20 w-3 rounded-full bg-white/70 blur-sm" />
                  </div>
                </div>

                <div className="px-2 pt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                      {product.category}
                    </p>
                  </div>

                  <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                    {product.name}
                  </h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-500">
                    {product.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-zinc-950">₹{product.price}</span>
                      {product.oldPrice ? (
                        <span className="text-sm text-zinc-400 line-through">₹{product.oldPrice}</span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="group/btn inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:bg-zinc-800"
                    >
                      View
                      <ArrowRightIcon className="h-4 w-4 transition group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="mt-16 rounded-[2rem] border border-zinc-200 bg-white/70 p-10 text-center shadow-sm backdrop-blur-xl">
              <ShoppingBagIcon className="mx-auto h-10 w-10 text-zinc-400" />
              <h3 className="mt-4 text-xl font-semibold">No products found</h3>
              <p className="mt-2 text-sm text-zinc-500">Try changing your search or category filter.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
