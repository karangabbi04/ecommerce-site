"use client";

import Autoplay from "embla-carousel-autoplay";

import { featuredProducts } from "@/components/Home/why-choose-us/home-data";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { FeaturedProductCard } from "./featured-product-card";
import { useRef } from "react";

export default function FeaturedProducts() {

      const autoplay = useRef(
  Autoplay({
    delay: 3600,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  })
);

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute left-[-10rem] top-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="absolute bottom-16 right-[-8rem] h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Featured Products
            </p>

            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
              Crafted for everyday beauty.
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-zinc-600 md:text-lg">
            Discover our most loved handcrafted pieces — made from recycled
            glass and finished by hand.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
        plugins={[autoplay.current]}
        >
          <CarouselContent className="-ml-4  py-4">
            {featuredProducts.map((product) => (
              <CarouselItem
                key={product.name}
                className="pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <FeaturedProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden bg-white/90 shadow-lg backdrop-blur-xl md:flex" />
          <CarouselNext className="hidden bg-white/90 shadow-lg backdrop-blur-xl md:flex" />
        </Carousel>
      </div>
    </section>
  );
}