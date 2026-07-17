"use client"
import { ShoppingBag } from "lucide-react";

interface ProductHeroProps {
  totalProducts: number;
}

export default function ProductHero({
  totalProducts,
}: ProductHeroProps) {
  return (
    <section className="relative overflow-hidden">

      {/* Background Blur */}
      <div className="absolute left-[-120px] top-10 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />

      <div className="absolute right-[-120px] top-20 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="container relative mx-auto px-4 py-20">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2">

            <ShoppingBag className="h-4 w-4 text-primary" />

            <span className="text-sm font-medium">

              Premium Collection

            </span>

          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">

            Handmade Products

          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">

            Discover beautiful handcrafted products made with
            recycled glass and sustainable materials.

          </p>

        </div>

      </div>

    </section>
  );
}