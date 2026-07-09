"use client";

import { reasons, promise, stats } from "./home-data";

import { PromiseCard } from "./promise-card";
import { ReasonsGrid } from "./reasons-grid";
import { SectionHeading } from "./section-heading";

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-24 text-zinc-950">
      {/* Decorative Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/80 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/80 to-transparent" />

        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />

        <div className="absolute bottom-[-12rem] right-[-10rem] h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="absolute left-[-10rem] top-1/3 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading

        badge="Why Choose Us"
        title="Not factory made. Story made."
        description="We turn ordinary waste into pieces that feel personal, premium, and kind to the planet."
        
        />

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ReasonsGrid reasons={reasons} />

          <PromiseCard
            promise={promise as any}
          />
        </div>
      </div>
    </section>
  );
}