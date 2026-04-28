"use client";

import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "@/lib/home-data";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function FeaturedProducts() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute left-[-10rem] top-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="absolute right-[-8rem] bottom-16 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Featured Products
            </p>

            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
              Crafted for everyday beauty.
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-zinc-600 md:text-lg">
            Discover our most loved handcrafted pieces — made from recycled glass and finished by hand.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2600,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4 py-4">
            {featuredProducts.map((product) => (
              <CarouselItem
                key={product.name}
                className="pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="group h-full overflow-hidden rounded-[2rem] border-zinc-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-900/10">
                  <CardHeader className="p-0">
                    <div
                      className={`relative flex h-72 items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${product.gradient}`}
                    >
                      <div className="absolute inset-6 rounded-[1.5rem] border border-white/70 bg-white/35 backdrop-blur-xl" />

                      <div className="absolute left-5 top-5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur-xl">
                        {product.tag}
                      </div>

                      <div className="relative h-40 w-24 rounded-b-[2.5rem] rounded-t-2xl border border-white/90 bg-white/45 shadow-2xl backdrop-blur-md">
                        <div className="absolute left-1/2 top-[-2.5rem] h-12 w-10 -translate-x-1/2 rounded-t-xl border border-white/90 bg-white/60" />
                        <div className="absolute left-4 top-6 h-24 w-3 rounded-full bg-white/70 blur-sm" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-3 pt-5">
                    <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                      {product.name}
                    </h3>

                    <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-500">
                      {product.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between px-3 pb-3 pt-2">
                    <span className="text-lg font-semibold text-zinc-950">
                      {product.price}
                    </span>

                    <Button size="sm" className="group rounded-full">
                      View
                      <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
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